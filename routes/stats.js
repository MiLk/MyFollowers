var Follower = require('../model/follower');
var twitter = require('./twitter');

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
    docs.forEach(function(doc) {
      twitter.updateUserScreenName(doc.lost_followers, doc.new_followers);
    });
    return res.send(200, { results: docs });
  });
};

