const UserModel = require("../user/UserModel");
const InlineKeyboards = require("../keyboards/InlineKeyboards");
const data =require('../data')
module.exports = class Functions {
  // User saqlash

  static async StartUser(ctx) {
    // console.log(ctx.message.text);
    try {
      const userId = ctx.from.id;
      const referralCode = ctx.startPayload; // This will contain the 'start' parameter
      const refer = await UserModel.findOne({
        chatId: referralCode,
      });
      const newUser = {
        first_name: ctx.message.chat.first_name,
        userName: ctx.message.chat.username,
        chatId: ctx.message.chat.id,
        step: 0,
        referrals: [],
        referralCode: ctx.startPayload,
        refID: refer?._id,
        refStatus:false,
        date: new Date(),
      };
      await UserModel.create(newUser);
      await Functions.JoinToChannel(ctx)
  
    } catch (err) {
      console.log(err);
    }
  }

  // Check join channel
  static async CheckJoin(ctx) {
    const channelsToJoin = data.channels // Add your desired channel names to this array

    const isUserAlreadyMember = async (channelName, userId) => {
      try { 
        const chatMember = await ctx.telegram.getChatMember(
          channelName,
          userId
        );
        return ["administrator", "member", "creator"].includes(chatMember.status);
      } catch (error) {
        console.error("Error checking channel membership:", error);
        return false;
      }
    };

    const userIsMemberOfAllChannels = async (channelsToJoin, userId) => {
      for (const channel of channelsToJoin) {
        const isMember = await isUserAlreadyMember(channel, userId);
        if (!isMember) {
          return false; // User is not a member of this channel
        }
      }
      return true; // User is a member of all specified channels
    };

    userIsMemberOfAllChannels(channelsToJoin, ctx.chat.id)
      .then(async (isMember) => {
        const user = await UserModel.findOne({
          chatId: ctx.chat.id,
        });
     

        //
        //  console.log(ref);
        if (!isMember) {
          // User is not a member of all specified channels, prompt them to join missing channels
          // console.log("User is not a member of all specified channels.");
          await ctx.answerCbQuery(`a'zolik aniqlanmadi`, true);
        
          // await Functions.JoinToChannel(ctx);
        } else {
          try {
            // Find the user document by refID
            const userToUpdate = await UserModel.findById(user?.refID);
            

           const isRef=await UserModel.findOne({
              'referrals': { $elemMatch: { chat_id: user?.chatId } }
            })
         
            


            if (userToUpdate && !isRef) {
              // Create a new referral object with the desired properties
              const newReferral = {
                chat_id: user.chatId,
                first_name: user.first_name,
                isJoinToChannel: true, // Set the initial value for isJoinChannel
              };

              // Push the new referral object to the referrals array
              userToUpdate.referrals.push(newReferral);

              // Save the updated user document
              const updatedUser = await userToUpdate.save();

              if (updatedUser) {
                await Functions.confirmShareLink(ctx);
                await Functions.NewReferral(ctx, user, updatedUser);
                  await Functions.PrivateLink(ctx,updatedUser);
                  await UserModel.findByIdAndUpdate(user._id, { step: 1 });
          
              } else {
                // The user document couldn't be updated
                console.log("Failed to update user document");
              }
            } else {
              // The user with the specified refID was not found
              await UserModel.findByIdAndUpdate(user._id, { step: 1 });
              await Functions.confirmShareLink(ctx);

              console.log("User not found with refID:", user.refID);
            }
          } catch (error) {
            // Handle any errors that occurred during the update
            console.error("Error updating user document:", error);
          }
          console.log("User is a member of all specified channels.");
          // Add your logic for users who meet the membership requirements.
        }
      })
      .catch((error) => {
        console.error("Error checking channel membership:", error);
      });
  }
  static async JoinToChannel(ctx) {
    await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Davom etish uchun ikkita ustozning kanaliga obuna bo’ling 👇`,
      {
        reply_markup: {
          resize_keyboard: true,
          one_time_keyboard: true,
          inline_keyboard: InlineKeyboards.linkChannel,
        },
      }
    );
  }
  static async ShareLink(ctx,updatedUser) {
    await ctx.telegram.sendDocument(ctx.chat.id, 'https://static.wixstatic.com/media/a27d24_8fb178f4640a44aea580e695ab27815f~mv2.gif', {
      caption:`⚡️2 ta Band 9.0, bitta BAND 8.5 va Band 8.0 holder'larda bepul FULL IELTS kurs.

      Qatnashishingizni tavsiya qilaman 👇
      
      [Bepul FULL IELTS kurs](https://t.me/${process.env.BOT_USERNAME}?start=${ctx.chat.id})`,
      parse_mode: 'Markdown',
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        inline_keyboard: [
          [
            {
              text: 'Kursga qatnashish',
              url: `https://t.me/${process.env.BOT_USERNAME}?start=${ctx.chat.id}`, // Set the URL dynamically
            },
          ],
        ],
      },
    });
    ctx.reply(`👆 Yuqoridagi postni do'stlaringiz bilan ulashing.

      5 nafar do'stingiz sizning taklif havolingiz orqali bot'ga kirib kanallarga a'zo bo'lsa, bot avtomatik tarzda sizga kurs uchun link beradi.
      
      Bot'da takliflar sonini hisoblashda yoki boshqa muammo sezsangiz @demo ga screenshot bilan yozib qoldiring. Sizning murojaatingiz muhim!`)
  }
  static async NewReferral(ctx, user, updatedUser) {
    await ctx.telegram.sendMessage(
      user.referralCode,
      ` ✅ ${user.first_name} taklif havolangiz orqali qo'shildi.

          Jami takliflaringiz soni ${updatedUser.referrals.length} ta. yangi referal mavjud`
    );
  }
  static async PrivateLink(ctx,updatedUser) {
    if (updatedUser.referrals.length===2) {
      
      await ctx.telegram.sendMessage(updatedUser.chatId, `✅ Takliflaringiz soni 5 taga yetdi va kursga muvaffaqiyatli ro'yxatdan o'tdingiz!

      🔗 Kurs uchun link: ${process.env.PRIVATE_LINK}
      
      ❗️Eslatma: Ushbu link orqali kanalga faqat bir marotaba qo'shilish mumkin!`);

    }
  }
  static async confirmShareLink(ctx) {
    // console.log("Updated User:", updatedUser);

      ctx.reply(`❗️Diqqat bilan o’qing!

      Kurs 100% bepul. Faqat, biz tashkil qilayotgan bepul kurslar ko'pchilikka yetib borishi uchun sizning yordamingiz juda ham zarur!
      
      Bot sizga taqdim etgan referral linkni atigi 5 nafar ingliz tili o'rganayotgan do'stingizga yuboring va bot sizga avtomatik tarzda kurs uchun link beradi.
      
      Kurs haqida to’liq ma’lumot va soatlari maxsus kanalda yozilgan
      
      Quyidagi tugmani bosing va taklif qilishni boshlang 👇`, {
        reply_markup: {
          resize_keyboard: true,
          one_time_keyboard: true,
          inline_keyboard: InlineKeyboards.confirmShareLink,
        },
      });
      
  }
};
