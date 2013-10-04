var stats = require('./stats');
var twitter = require('./twitter');

function routes(app) {
  app.post('/', twitter.refresh);
  app.get('/stats/:screen_name', stats.getStats);
};

module.exports = routes;
