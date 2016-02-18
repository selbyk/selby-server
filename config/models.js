module.exports = {
  "Auth": {
    "description": "Identity to perma track user from cookie setting",
    "type": "object",
    "x-dbAdapter": "none",
    "properties": {
      "username": {
        "description": "Username",
        "type": "string"
      },
      "password": {
        "description": "Password",
        "type": "string"
      }
    }
  },
  "Log": {
    "description": "Log",
    "type": "object",
    "x-dbAdapter": "sequelize",
    "properties": {
      "type": {
        "type": "string"
      },
      "code": {
        "type": "integer"
      },
      "message": {
        "type": "string"
      },
      "time": {
        "type": "string",
        "format": "date-time"
      }
    }
  },
  "Error": {
    "description": "Error message",
    "type": "object",
    "required": ["code",
      "message"
    ],
    "properties": {
      "id": {
        "description": "Unique id",
        "type": "integer",
        "x-sequelize": {
          "unique": true,
          "primaryKey": true
        }
      },
      "code": {
        "type": "integer",
        "format": "int32"
      },
      "message": {
        "type": "string"
      },
      "time": {
        "type": "string",
        "format": "date-time"
      }
    }
  }
};
