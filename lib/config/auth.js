'use strict';

module.exports = {

  'googleAuth' : {
    'clientID'    : '956875282901.apps.googleusercontent.com',
    'clientSecret'  : process.env.GOOGLE || 'auMZbzqXDvkS7j7qHmSEJisN',
    'callbackURL'   : 'http://localhost:80/auth/google/callback'
  }
};