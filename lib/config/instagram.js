instagram = require('instagram-node-lib');
instagram.set('client_id', process.env.INSTA_ID);
instagram.set('client_secret', process.env.INSTA_SECRET);
instagram.set('callback_url', 'http://cmwc14.cloudapp.net/apiw/instagram/callback');
instagram.set('redirect_uri', 'http://cmwc14.cloudapp.net');

module.exports = instagram;
