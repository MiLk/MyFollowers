const mongoose = require('mongoose');

const followerSchema = mongoose.Schema({
  screen_name    : { type: String, required: true },
  created_at     : { type: Date  , required: true },
  followers      : { type: Array                  },
  new_followers  : { type: Array                  },
  lost_followers : { type: Array                  }
});
followerSchema.index({ screen_name: 1, created_at: -1 });

const Follower = mongoose.model('Follower', followerSchema);
module.exports = Follower;
