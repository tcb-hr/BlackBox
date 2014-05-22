'use strict';

module.exports = {

  'googleAuth' : {
    'clientID'    : process.env.GOOGLE_ID,
    'clientSecret'  : process.env.GOOGLE || 'auMZbzqXDvkS7j7qHmSEJisN',
    'callbackURL'   :  process.env.IP + '/api/google/callback'
  }
};
