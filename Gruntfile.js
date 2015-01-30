/*
  
  THIS IS NOT THE BUILD TOOL YOU ARE LOOKING FOR.
  
  We have a Grunt task set up specifcally to run the theme settings generator because there is no Gulp version.
  This is called from inside Gulp so there is no need to run this here.
  Note: this can be removed when Shopify fully rolls out the new theme editor!
  
  We also use Grunt modernizer because the gulp one sucked.
*/

module.exports = function(grunt) {
  
  grunt.initConfig({
    shopify_theme_settings: {
      settings: {
        options: {
          templates: ['settings/templates']
        },
        files: {
          'theme/config/settings.html': [
            'settings/layout.yml',
            'settings/navigation.yml'
          ]
        }
      }
    },
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
  
  grunt.loadNpmTasks('grunt-shopify-theme-settings');
  grunt.loadNpmTasks("grunt-modernizr");
};