const texts = require("../text.json");
module.exports = {
  languages: new Array(
    new Array(
      {
        text: texts.uz.lan,
        callback_data: "uz",
      },
      {
        text: texts.ru.lan,
        callback_data: "ru",
      },
      {
        text: texts.in.lan,
        callback_data: "in",
      }
    )
  ),
  setInlineKey: new Array(
    new Array(
      {
        text: "yo'q",
        callback_data: "no",
      },
      {
        text: "Ha",
        callback_data: "ok",
      }
    )
  ),
  setInlineMeet: new Array(
    new Array(
      {
        text: "Ortga",
        callback_data: "no",
      },
      {
        text: "Meeting",
        url: "https://zoom.us/",
      }
    )
  ),
  setInlineServiceTrue: new Array(
    new Array({
      text: "Tasdiqlash",
      callback_data: "tasdiq",
    })
  ),
  setOldService: new Array(
    new Array(
      {
        text: "Ortga",
        callback_data: "no",
      },
      {
        text: "Avvalgi chaqiruvlar",
        callback_data: "oldService",
      }
    )
  ),
  linkChannel: new Array(
    new Array(
      {
        text: "JK-IELTS",
        url: "https://t.me/sx1020",
      },
     
      
    ),
   new Array(
 
      {
        text: "SX-GROUP",
        url: "https://t.me/saidmurodjon_x",
      }
  
      
    ),
    new Array(
     
      {
        text: "Tekshirish",
        callback_data: "joinCheck",
      }
      
    )
  ),
  confirmShareLink: new Array(
    new Array(
      {
        text: "Taklif posti",
        callback_data: "confirmShareLink",
      },
     
    )
  ),
  refLink: new Array(
    new Array(
      {
        text: "Kursga qatnashish",
        url: "refLink",
      },
     
    )
  ),
};
