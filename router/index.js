/**
 * Module responsible for setting up and managing socket connections
 * @module router
 */
// Import our logger
//import logger from '../lib/logger';
import fs from 'fs';
import path from 'path';
import Router from 'koa-router';

/** koa-router instance */
const router = new Router();
/** path to files being served (docs) */
const routesPath = path.resolve(__dirname);

/*
    Load our broadcasts that emit messages
 */
fs.readdir(routesPath, function(err, files) {
  files
    .filter(function(file) {
      return file.substr(-3) === '.js' && file.substr(-8) !== 'index.js';
    })
    .forEach(function(file) {
      require(routesPath + '/' + file)(router);
    });
});

module.exports = router;
