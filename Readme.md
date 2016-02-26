selby-server
---

selby-server is an koa/socket.io based ES6/ES7 node server developed
with security and convenience in mind. Its purpose is to replace
the current server running https://selby.io/ and to be a template for future
servers generated mostly from a spec document

### Development Environment

#### Node Version Manager (NVM)
NVM isn't required, but node 5+ is and NVM provides a virtual environment that makes managing multiple node.js versions simple.

 - [NVM Readme (Install Instructions)](https://github.com/creationix/nvm/blob/master/README.markdown)

#### Node 5

If you have NVM installed, getting node 5+ is as simple as `$ nvm install 5`, or `$ nvm use 5` if a version of node 5 is already installed.

#### Grunt

A task runner used for automation and performing repetitive tasks like minification, compilation, unit testing, and linting.

It must be installed globally (`$ npm i -g grunt-cli`) so that it can be executed from a shell. Then, to start selby-sever run: `$ grunt`

### Step by Step

1. Install NVM
```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
```

2. Install or use node 5+
```bash
$ . ~/.nvm/nvm.sh
$ nvm install 5
$ nvm use 5
```

3. Install grunt
```bash
$ npm i -g grunt-cli # No sudo with NVM
```

4. Clone repo and install dependencies
```bash
$ git clone https://github.com/selbyk/selby-server.git
$ cd selby-server
$ git submodule init # clone custom middleware
$ git submodule update
$ npm i
```

4. Start the build manager
```bash
$ grunt
```

You should now be able to access the server at http://localhost:5644 if everything went smoothly
