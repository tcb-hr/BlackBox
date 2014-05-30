'use strict';

module.exports = {

  'googleAuth' : {
    'clientID'    : process.env.GOOGLE_ID,
    'clientSecret'  : process.env.GOOGLE,
    'callbackURL'   :  'http://cmwc14.cloudapp.net/api/google/callback'
  }
};


// http://cmwc14.cloudapp.net/api/google/callback
// http://cmwc14.cloudapp.net/api/google/callback