const data = require("../data");
const linkChannelArray = data.linkChannel.map((row) =>
  row.map((button) => ({
    text: button.text,
    url: button.url,
    callback_data: button.callback_data,
  }))
);
module.exports = {




  linkChannel: linkChannelArray,
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
