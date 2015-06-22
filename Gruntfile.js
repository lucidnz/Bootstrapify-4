/*
  
  THIS IS NOT THE BUILD TOOL YOU ARE LOOKING FOR.
  
  We have a Grunt task set up specifcally to run modernizer because the gulp one sucked.
  This should be run via gulp.
  
*/

module.exports = function(grunt) {
  
  grunt.initConfig({
    modernizr: {
      dist: {
        "devFile" : "remote",
        "outputFile" : "theme/assets/modernizr.js",
        "extra" : {
          "load" : false
        },
        "files" : {
          "src": ['./src/**/*.*']
        }
      }
    }
  });
  
  grunt.loadNpmTasks("grunt-modernizr");
};