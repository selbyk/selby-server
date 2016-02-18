module.exports =  {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Client Survey",
    "description": "Sumome interview coding test with the following requirements: 1. allow an admin to enter survey questions with multiple choice answers; 2. present a random survey question to guest and allow them to answer; 3. Record answers and display the survey results in an admin interface; 4. Avoid showing a previously answered question to the same guest. This API specification is used to generate the backend side implementation, and number four is taken care of by local storage on the front end.",
    "contact": {
      "name": "Selby Kendrick",
      "url": "https://selby.io"
    },
    "license": {
      "name": "MIT",
      "url": "http://creativecommons.org/licenses/by/4.0/"
    }
  },
  "host": "localhost:8000",
  "basePath": "/",
  "schemes": ["http"],
  "consumes": ["application/json"],
  "produces": ["application/json"],
  "security": [{
    "admin": [
      "logs:view"
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
