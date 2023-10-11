const UserModel = require("../user/UserModel");
const InlineKeyboards = require("../keyboards/InlineKeyboards");

module.exports = class Functions {
  // User saqlash

  static async StartUser(ctx) {
    // console.log(ctx.message.text);
    try {
      const userId = ctx.from.id;
      const referralCode = ctx.startPayload; // This will contain the 'start' parameter
      const newUser = {
        userName: ctx.message.chat.username,
        chatId: ctx.message.chat.id,
        step: 0,
        referrals: 0,
        referralCode:ctx.startPayload,
        date: new Date(),
      };
      await UserModel.create(newUser);
      // Process the referral code or perform any other logic here
      // if (referralCode) {
        // ctx.reply(`Hello! You used the referral code: ${referralCode}`);
      // } else {
      //   ctx.reply(`Salom `);
      // }
console.log(referralCode);
      await ctx.telegram.sendMessage(
        ctx.message.chat.id,
        `Salom  ${ctx.message.from.first_name} 
        link olish uchun ushbu telegram kanaga a'zo bo'lishizkerak `,
        {
          reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
            inline_keyboard: InlineKeyboards.linkChannel,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  // Check join channel
  static async CheckJoin(ctx) {
    const channel = "@sx1020";
    const up = ctx.update.callback_query;
    const chatMember = await ctx.telegram.getChatMember(channel, ctx.chat.id);
    const isSubscribed = await ["administrator", "member", "owner"].includes(
      chatMember.status
    );

    console.log(isSubscribed);
    try {
      if (isSubscribed) {
        let newUser={step:1}
        const user = await UserModel.findOne({
          chatId: ctx.chat.id,
        });
        const refer = await UserModel.findOne({
          chatId: user.referralCode,
        });
       await UserModel.findByIdAndUpdate(user._id, );
       const referral= await UserModel.findByIdAndUpdate(user._id, {referrals:1});
   
        await ctx.telegram.sendMessage(
          ctx.chat.id,
          `${up.from.first_name} Siz obuna bo'lgansiz`,
          {
            reply_markup: {
              resize_keyboard: true,
              one_time_keyboard: true,
              inline_keyboard: InlineKeyboards.linkChannel,
            },
          }
        );   await ctx.telegram.sendMessage(
          user.referralCode,
          `${up.from.first_name} Sizda yangi referal mavjud`
        );
      } else {
        await ctx.telegram.sendMessage(
          ctx.chat.id,
          `${up.from.first_name} siz avval yuqoridagi telegram kanalga a'zo bo'lishingiz kerak!`,
          {
            reply_markup: {
              resize_keyboard: true,
              one_time_keyboard: true,
              inline_keyboard: InlineKeyboards.linkChannel,
            },
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
};
