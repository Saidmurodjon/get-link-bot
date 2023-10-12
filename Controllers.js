
const Functions = require("./functions/Functions");
const UserModel = require("./user/UserModel");
const texts = require("./text.json");
const InlineKeyboards = require("./keyboards/InlineKeyboards");
module.exports = class Controllers {
  static async StartReferral(ctx, bot) {
    const chat_id = ctx.message.chat.id;
    const user = await UserModel.findOne({
      chatId: chat_id,
    });
    if (!user){
      await Functions.StartUser(ctx);

    }
    else if (user && user.step===0) {
      await Functions.JoinToChannel(ctx);
      
    }else if(user && user.step===1){
    await Functions.confirmShareLink(ctx)
    }
  }
  static async MessageController(ctx, bot) {
    const chat_id = ctx.message.chat.id;
    const user = await UserModel.findOne({
      chatId: chat_id,
    });
      ctx.telegram.sendMessage(
        chat_id,
        'Something went wrong!'
      );
  
  }
  // Inline controller
  static async InlineController(ctx) {
    const up = ctx.update.callback_query;
    const user = await UserModel.findOne({
      chatId: up.from.id,
    });

    if (up.data === "joinCheck") {
      await Functions.CheckJoin(ctx );
    }
    if (up.data === "confirmShareLink") {
      await Functions.ShareLink(ctx );
    }
  }
};
