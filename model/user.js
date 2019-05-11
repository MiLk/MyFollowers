const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id            : { type: Number, required: true },
  screen_name    : { type: String, required: true },
  name           : { type: String                 },
  description    : { type: String                 },
  created_at     : { type: Date  , required: true, expires: 60*60*24*7 }
});
userSchema.index({ _id: 1, created_at: -1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
