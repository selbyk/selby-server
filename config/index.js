'use strict';
//import _ from 'lodash';
var _ = require('lodash');
var util = require('util');
var fs = require('fs');
//var crypto = require('crypto');
//var bcrypt = require('bcrypt');
//var http = require('http');
var path = require('path');

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
