instagram = require('instagram-node-lib');
instagram.set('client_id', 'ce171905d26343f4b73d255d2b2f0087');
instagram.set('client_secret', '033e27ced8cc432fac275aa5c4c046a8');
instagram.set('callback_url', 'http://138.91.64.150:8000/callback');
instagram.set('redirect_uri', 'http://138.91.64.150:8000');

module.exports = instagram;
