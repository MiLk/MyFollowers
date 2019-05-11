const stats = require('./stats');
const twitter = require('./twitter');

module.exports = (app) => {
  app.post('/', twitter.refresh);
  app.get('/stats/:screen_name', stats.getStats);
};
