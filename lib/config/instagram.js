instagram = require('instagram-node-lib');
instagram.set('client_id', process.env.INSTA_ID || 'ce171905d26343f4b73d255d2b2f0087');
instagram.set('client_secret', process.env.INSTA_SECRET || '033e27ced8cc432fac275aa5c4c046a8');
instagram.set('callback_url', process.env.IP + ':80/callback');
instagram.set('redirect_uri', process.env.IP + ':80');

module.exports = instagram;
