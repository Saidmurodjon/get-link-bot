const mongoose = require("mongoose");

// product uchun

const userSchema = mongoose.Schema({
  first_name:String,
  userName: String,
  chatId: String,
  language: String,
  step: Number,
  referrals:[{chat_id:String,first_name:String,isJoinToChannel:{default:false, type:Boolean} }],
  referralCode:String,
  refStatus:Boolean,
  refID:String,

});

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
