const { Tiktok, Youtube } = require("./Downloader");
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
    if (user && user.step===0) {
      await ctx.telegram.sendMessage(
        ctx.chat.id,
        `siz avval yuqoridagi telegram kanalga a'zo bo'lishingiz kerak!`,
        {
          reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
            inline_keyboard: InlineKeyboards.linkChannel,
          },
        }
      )
      
    }else if(user && user.step===1){
      ctx.reply(`Do'stlarni taklif qilish`, {
        reply_markup: {
          resize_keyboard: true,
          one_time_keyboard: true,
          inline_keyboard: InlineKeyboards.linkChannel,
        },
      });
    }else{
      await Functions.StartUser(ctx);
    }
   
  }
  static async MessageController(ctx, bot) {
    const chat_id = ctx.message.chat.id;
    const user = await UserModel.findOne({
      chatId: chat_id,
    });
    // const user = await BotUserModel.findOne({ chatID: chat_id });
    // console.log(ctx.message);
    const text = ctx.message?.text
    // const start="https://t.me/mybot?start=nimadir"

   if (text === "/about") {
      await ctx.replyWithChatAction("typing");

      await ctx.telegram.sendMessage(
        chat_id,
        user.language == "uz"
          ? texts.uz.abaut
          : user.language == "ru"
          ? texts.ru.abaut
          : user.language == "in"
          ? texts.in.abaut
          : null
      );
    } else {
      ctx.telegram.sendMessage(
        chat_id,
        'Nimdir xato ketti'
      );
    }
  }
  // Inline controller
  static async InlineController(ctx) {
    const up = ctx.update.callback_query;
    const user = await UserModel.findOne({
      chatId: up.from.id,
    });

    if (up.data === "joinCheck") {
      await Functions.CheckJoin(ctx);
    }
  }
};
