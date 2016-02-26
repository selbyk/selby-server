/*global module:false*/
module.exports = function(grunt) {
  require('jit-grunt')(grunt); // npm install --save-dev load-grunt-tasks
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    //clean: {
    //  build: ["path/to/dir/one", "path/to/dir/two"],
    //  release: ["path/to/another/dir/one", "path/to/another/dir/two"]
    //},
    exec: {
      docGen: 'echo hey',//'bootprint swagger ./config/surveyapi.json docs/api'
    },
    concurrent: {
      watchers: {
        tasks: ['watch:server', 'nodemon:dev'],
        options: {
          logConcurrentOutput: true
        }
      },
      target2: ['jshint', 'mocha']
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['node5'],
        //modules: "common",
        plugins: ["transform-es2015-modules-commonjs"]
      },
      build: {
        files: [{
          expand: true,
          src: ['selby-server.js','config/**/*.js', 'services/**/*.js', 'router/**/*.js','lib/**/*.js','middleware/**/*.js','models/**/*.js','tests/**/*.js','transports/**/*.js'],
          dest: 'runtime/server',
          ext: '.js'
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['selby-server.js', 'router/**/*.js', 'services/**/*.js', 'models/**/*.js','lib/**/*.js','middleware/**/*.js', 'tests/**/*.js']
    },
    eslint: { // configure the task
      // lint your project's server code
      server: {
        src: ['selby-server.js']
      }
    },
    watch: {
      server: {
        files: ['**/*.js', 'Gruntfile.js'],
        tasks: ['build'],
        //options: {
        //  livereload: true
        //}
      },
      config: {
        files: ['config/*.js'],
        tasks: ['copy:config'],
        //options: {
        //  livereload: true
        //}
      }
    },
    /**
      The nodemon task will start your node server. The watch parameter will tell
      nodemon what files to look at that will trigger a restart. Full grunt-nodemon
      documentation
    **/
    nodemon: {
      dev: {
        script: 'runtime/server/selby-server.js',
        options: {
          /** Environment variables required by the NODE application **/
          env: {
            "NODE_ENV": "development",
            "NODE_CONFIG": "dev"
          },
          watch: ["runtime/**/*"],
          delay: 300,
          callback: function(nodemon) {
            nodemon.on('log', function(event) {
              console.log(event.colour);
            });
            /** Open the application in a new browser window and is optional **/
            nodemon.on('config:update', function() {
              // Delay before server listens on port
              setTimeout(function() {
                //require('open')('http://127.0.0.1:8000');
              }, 1000);
            });
            /** Update .rebooted to fire Live-Reload **/
            nodemon.on('restart', function() {
              // Delay before server listens on port
              setTimeout(function() {
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 1000);
            });
          }
        }
      }
    },
    'swagger-docs': {
      dev: {
        src: ['src/api/swagger/swagger.yaml'],
        dest: 'src/api/swagger/swagger.json',
      }
    },
    'swagger-js-codegen': {
      main: {
        options: {
          apis: [{
            swagger: 'config/swagger.json',
            className: 'Sink',
            fileName: 'sink.js',
            moduleName: 'sink'
          }],
          dest: 'example'
        },
        dist: {}
      }
    },
    jsdoc: {
      dist: {
        cwd: '',
        src: ['runtime/server/**/*.js'],
        options: {
          destination: 'docs/jsdocs'
        }
      }
    },
    copy: {
      build: {
        files: [
          {src: 'config/surveyapi.json', dest: 'public/surveyapi.json'},
          // includes files within path
          //{expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},

          // includes files within path and its sub-directories
          {
            expand: true,
            cwd: 'src/',
            src: ['**', '!*.js'],
            dest: 'build/'
          }, {
            expand: true,
            cwd: 'tmp/',
            src: ['**'],
            dest: 'build/'
          },

          // makes all src relative to cwd
          //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

          // flattens results to a single level
          //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
        ],
      },
    },
    tape: {
      options: {
        pretty: true,
        output: 'console'
      },
      files: ['tests/**/*.js']
    }
  });

  // Default task.
  grunt.registerTask('default', ['build', 'concurrent:watchers']);
  //grunt.registerTask('run', ['watch:server','run' ]);
  grunt.registerTask('build', ['jshint', 'transpile']);
  grunt.registerTask('transpile', ['babel:build', 'jsdoc', 'exec:docGen']);
  //grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
  //grunt.registerTask('default', ['concurrent:target1', 'concurrent:target2']);
  // yaml tester for ./PATH/TO/YOUR/SWAGGER.yaml
  grunt.task.registerTask('yamlTest', ['jshint', 'swagger-js-codegen:main']);
};
