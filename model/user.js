var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  _id            : { type: Number, required: true },
  screen_name    : { type: String, required: true },
  name           : { type: String                 },
  description    : { type: String                 },
  created_at     : { type: Date  , required: true, expires: 60*60*24*7 }
});
userSchema.index({ _id: 1, created_at: -1 });

var User = mongoose.model('User', userSchema);
module.exports = User;
