var config = require('config')
  , twitter = require('twitter')
  , _ = require('underscore')._
  ;

var util = require('util');

var Follower = require('../model/follower');
var User = require('../model/user');

var twit = new twitter(config.twitter);

var handleError = function (err) {
  if (err) return console.error(err);
};

var onPreviewDatas = function (err, screen_name, follower, doc, callback) {
  if (err) {
    console.error(err);
    follower.save(handleError);
    return callback(follower);
  }
  if (!doc) {
    console.log('No history for: ' + screen_name);
    follower.save(handleError);
    return callback(follower);
  }
  follower.new_followers = _.difference(follower.followers, doc.followers);
  follower.lost_followers = _.difference(doc.followers, follower.followers);
  follower.save(handleError);
  return callback(follower);
};

var onFollowersReceived = function (screen_name, data, callback) {
  var follower = new Follower({
    screen_name: screen_name,
    created_at: new Date(),
    followers: data['ids']
  });
  Follower.findOne({
    screen_name: screen_name
  }, {
    followers: 1
  }).lean().sort({
      created_at: -1
    }).exec(function (err, doc) {
      onPreviewDatas(err, screen_name, follower, doc, callback);
    });
};

var updateUserScreenName = function(lost_followers, new_followers) {
  var ids = lost_followers.concat(new_followers);
  User.find({
    "_id": { "$in": ids }
  }, {
    "_id": 1
  }, function(err, docs) {
    if(err) return console.error(err);
    var unknown = _.difference(ids, _.reduce(docs, function(memo, doc) { return memo.concat(doc.unique_id); }, []));
    if(unknown.length == 0) return;
    twit.get('/users/lookup.json', {
      user_id: unknown.join(','),
      inlude_entities: false
    }, function(data) {
      data.forEach(function(row) {
        User.update({
          _id: row.id
        }, {
          screen_name: row.screen_name,
          name: row.name,
          description: row.description,
          created_at: new Date()
        }, { upsert: true }, handleError);
      });
    });
  });
};

module.exports.updateUserScreenName = updateUserScreenName;

module.exports.refresh = function (req, res) {
  if (!req.body.screen_name) return res.send(400, { "message": "You must provide a screen_name." });
  var onStats = function (follower) {
    res.send(200, {
      screen_name: follower.screen_name,
      followers_count: follower.followers.length,
      lost_followers: follower.lost_followers,
      new_followers: follower.new_followers
    });
    updateUserScreenName(follower.lost_followers, follower.new_followers);
  };
  twit.get('/followers/ids.json', {
    screen_name: req.body.screen_name,
    cursor: -1
  }, function (data) {
    onFollowersReceived(req.body.screen_name, data, onStats);
  });
};
