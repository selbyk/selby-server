'use strict';
/**
 * Loads all files in the config/ directory and returns a single
 * object
 * @module config
 */
var _ = require('lodash');
//var util = require('util');
//var fs = require('fs');
//var path = require('path');

let loadConfig = () => {
  return {
    spec: _.merge(require('./api'), {
      paths: require('./routes')
    }, {
      definitions: require('./models')
    })
  };
};

module.exports = loadConfig();
