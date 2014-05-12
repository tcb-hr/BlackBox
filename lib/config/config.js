'use strict';

var _ = require('lodash');

/**
 * Load environment configuration
 */
module.exports = _.merge(
    require('./env/all.js'),
    require('./env/development.js') || {});