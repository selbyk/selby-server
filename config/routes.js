module.exports = {
  "/log": {
    "get": {
      "tags": ["Logs"],
      "summary": "Returns log list",
      "x-authorize": "scopes/log.js",
      "security": [{
        "admin": ["logs:view"]
      }],
      "responses": {
        "200": {
          "description": "logs response",
          "schema": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/Log"
            }
          },
          "headers": {
            "x-expires": {
              "type": "string"
            }
          }
        },
        "default": {
          "description": "unexpected error",
          "schema": {
            "$ref": "#/definitions/Error"
          }
        }
      }
    }
  },
  "/auth": {
    "post": {
      "tags": ["Authentication"],
      "summary": "Returns access_token",
      "responses": {
        "200": {
          "description": "Token response",
          "schema": {
            "type": "#/definitions/Token"
          }
        },
        "default": {
          "description": "unexpected error",
          "schema": {
            "$ref": "#/definitions/Error"
          }
        }
      }
    }
  }
};
