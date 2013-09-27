var mongoose = require('mongoose');

var followerSchema = require('../schema/follower');

var Follower = mongoose.model('Follower', followerSchema);
module.exports = Follower;

