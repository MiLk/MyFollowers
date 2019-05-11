const config = require('config');
const twitter = require('twitter');
const _ = require('underscore')._;

const Follower = require('../model/follower');
const User = require('../model/user');

const twitterClient = new twitter(config.twitter);

const handleError = function (err) {
  if (err) return console.error(err);
};

const updateStats = function (screen_name, followers) {
  const follower = new Follower({
    screen_name: screen_name,
    created_at: new Date(),
    followers: followers['ids']
  });
  return Follower
    .findOne({
      screen_name: screen_name
    }, {
      followers: 1
    })
    .lean()
    .sort({
      created_at: -1
    })
    .exec()
    .then(doc => {
      if (!doc) {
        console.log('No history for: ' + screen_name);
        return follower.save();
      }
      follower.new_followers = _.difference(follower.followers, doc.followers);
      follower.lost_followers = _.difference(doc.followers, follower.followers);
      return follower.save();
    });
};

const updateUserScreenName = function (ids) {
  User.find({
    "_id": {"$in": ids}
  }, {
    "_id": 1
  }, function (err, docs) {
    if (err) return console.error(err);
    const known = _.reduce(docs, function (memo, doc) {
      return memo.concat(doc._id);
    }, []);
    let unknown = _.difference(ids, known);
    if (unknown.length === 0) return;
    if (unknown.length > 100) {
      unknown = unknown.splice(0, 100);
    }
    unknown = unknown.join(',');
    if (unknown.length > 1024) {
      unknown = unknown.substr(0, 1024);
      unknown = unknown.substr(0, unknown.lastIndexOf(','));
    }
    twitterClient.get('/users/lookup', {
      user_id: unknown,
      inlude_entities: false
    }, function (data) {
      if (!Array.isArray(data)) return handleError(data);
      data.forEach(function (row) {
        User.update({
          _id: row.id
        }, {
          screen_name: row.screen_name,
          name: row.name,
          description: row.description,
          created_at: new Date()
        }, {upsert: true}, handleError);
      });
    });
  });
};

module.exports.updateUserScreenName = updateUserScreenName;

module.exports.refresh = (req, res) => {
  if (!req.body.screen_name) {
    return res.status(400).send({"message": "You must provide a screen_name."});
  }
  module.exports.doRefresh(req.body.screen_name)
    .then(follower => {
      res.send({
        screen_name: follower.screen_name,
        followers_count: (follower.followers ? follower.followers.length : 0),
        lost_followers: follower.lost_followers,
        new_followers: follower.new_followers
      });
      const ids = follower.lost_followers.concat(follower.new_followers);
      updateUserScreenName(ids);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({"error": err.toString()});
    });
};

module.exports.doRefresh = function (screen_name) {
  return twitterClient.get('/followers/ids', {
    screen_name: screen_name,
    cursor: -1
  })
    .then(followers => updateStats(screen_name, followers));
};
