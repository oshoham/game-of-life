module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        }
      },
      dist: {
        options: {
          transform: [
            ["babelify", { presets: ["es2015"] }],
            ["glslify"]
          ]
        },
        files: {
          "./dist/game-of-life.js": ["./modules/**/*.js"]
        }
      }
    },
    watch: {
      scripts: {
        files: ["./modules/*.js"],
        tasks: ["browserify"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["watch"]);
  grunt.registerTask("build", ["browserify"]);
};
