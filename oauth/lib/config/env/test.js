'use strict';

module.exports = {
  env: 'test',
  mongo: {
    uri: 'mongodb://localhost/fullstack-test'
  },
  google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback"
  }
};
