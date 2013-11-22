var Follower = require('../model/follower');
var User = require('../model/user');
var twitter = require('./twitter');
var _ = require('underscore');

module.exports.getStats = function (req, res) {
  if (!req.params.screen_name) return res.send(400, { "message": "You must provide a screen_name." });
  Follower.find({
    screen_name: req.params.screen_name
  }, {
    _id: 0,
    created_at: 1,
    lost_followers: 1,
    new_followers: 1
  }, function (err, docs) {
    if (err) return res.send(500, { "message": err.toString() });
    var ids = _.reduce(docs, function(memo, doc) {
      return memo.concat(doc.lost_followers).concat(doc.new_followers);
    }, []);
    twitter.updateUserScreenName(ids);
    User.find({
      "_id": { "$in": ids }
    }, {
      "_id": 1,
      "name": 1,
      "screen_name": 1
    }, function(err, users) {
      if (err) return res.send(500, { "message": err.toString() });
      var obj = {};
      users.forEach(function(user) {
        obj[user._id] = user;
      });
      return res.send(200, { results: docs, users: obj });
    });
  });
};

