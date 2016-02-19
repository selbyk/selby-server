module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "selby-server",
    "description": "selby-server is an koa/socket.io based ES6 node server developed with security and convenience in mind. Its purpose is to replace the current server running https://selby.io/ and to be a template for future servers generated mostly from a spec document",
    "contact": {
      "name": "Selby Kendrick",
      "url": "https://selby.io"
    },
    "license": {
      "name": "MIT",
      "url": "http://creativecommons.org/licenses/by/4.0/"
    }
  },
  "host": "selby.io:5644",
  "basePath": "/",
  "schemes": ["http"],
  "consumes": ["application/json"],
  "produces": ["application/json"],
  "security": [{
    "admin": [
      "logs:view",
      "stats:view"
    ]
  }],
  "securityDefinitions": {
    "admin": {
      "x-authorize": "scopes/log.js",
      "type": "accessToken",
      "name": "Authorization",
      "in": "header",
      "scopes": {
        "logs:view": "Ability to view logs"
      }
    }
  }
};
