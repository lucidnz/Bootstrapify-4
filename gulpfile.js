/*
  Bootstrapify build tasks
*/

var gulp        = require('gulp'),
  gutil         = require('gulp-util'),
  zip           = require('gulp-zip'),
  plumber       = require('gulp-plumber'),
  jshint        = require('gulp-jshint'),
  vsource       = require('vinyl-source-stream'),
  browserify    = require('browserify'),
  concat        = require('gulp-concat'),
  jsoncombine   = require('gulp-jsoncombine'),
  rename        = require('gulp-rename'),
  pjson         = require('./package.json'),
  SassImport    = require('./utils/sass_import.js');

// Setup gulp-grunt so that we can automatically run grunt tasks from inside gulp
require('gulp-grunt')(gulp);

// Basic error messages output to the console.
// Used with plumber so we don't stop the other tasks from running or kill the gulp process on an error
var onError = function (err) {
  gutil.beep();
  gutil.log(gutil.colors.red(err));
};

/*
  Default tasks
*/

// Default watch tasks for ease of development
// just run `gulp`
gulp.task('default', function () {
  // watch for sass changes
  gulp.watch([
    './src/scss/*.scss',
    './src/scss/*.scss.liquid',
    './src/scss/*/*.scss.liquid'
  ], ['sass']);
  
  // watch for js changes
  gulp.watch([
    './src/js/*.js'
  ], ['js']);
  
  // watch for settings changes
  gulp.watch([
    './settings_schema/*.json',
    './settings_html/*.yml'
  ], ['settings']);
});

// Helper for js tasks
gulp.task('js', ['js_lint', 'js_modernizr', 'js_browserify']);

// Helper for sass tasks
gulp.task('sass', ['sass_concat']);

// Helper for settings tasks
gulp.task('settings', ['shopify_theme_settings']);

// Helper task for moving all asset dependancies to the theme assets folder and 
gulp.task('assets', ['js_assets']);

// ALL THE TASKS!!! plus zipping up a fully built theme
gulp.task('build', ['js', 'sass', 'settings', 'assets', 'zip']);

/*
  Tasks - This is where the heavy lifting is done
*/

// SASS_CONCAT: Pull our scss files together and move them into the themes assets
gulp.task('sass_concat', function () {
  var paths = new SassImport('./src/scss/styles.scss');
  return gulp.src(paths)
    .pipe(concat('styles.scss.liquid'))
    .pipe(gulp.dest('./theme/assets/'));
});

// JS_LINT: Check we are not doing silly stuff with our JS
//  also copy our un built js files to the assets folder for sanity's sake
gulp.task('js_lint', function () {
  return gulp.src('./src/js/*.js')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('./theme/assets/'));
});

// JS_BROWSERIFY: Build our js files ready for use in the browser
gulp.task('js_browserify', function () {
  return browserify('./src/js/app.js', {
      debug: true, // output source maps for easy debuging
      standalone: 'app'
    })
    .transform('debowerify') // require js files from bower packages
    .transform({ global: true }, 'uglifyify')
    .bundle()
    .pipe(vsource('app.min.js'))
    .pipe(gulp.dest('./theme/assets/'));
});

// JS_ASSETS: Copy all of the JS files to the theme assets. Maintain a list of paths to the src files here. All JS dependancies
gulp.task('js_assets', function () {
  // List of js files to be copied
  var files = [
    './src/js/*.js',
    './bower_components/jquery/dist/jquery.min.*',
    './bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js', // One minified file that contains everything is SOOO much better than multiple requests!
    './bower_components/respond/cross-domain/respond-proxy.html',
    './bower_components/respond/dest/respond.min.js',
    './bower_components/shopify-cartjs/dist/cart.js',
    './bower_components/picturefill/dist/picturefill.min.js'
  ];
  
  // rename respond.proxy.js to respond.liquid
  gulp.src('./bower_components/respond/cross-domain/respond.proxy.js')
    .pipe(rename('respond.liquid'))
    .pipe(gulp.dest('./theme/snippets/'));
  
  // copy files across to the assets folder
  return gulp.src(files)
    .pipe(gulp.dest('./theme/assets/'));
});

// ZIP: Cretae a zipped file of the theme that can be uploaded to Shopify
gulp.task('zip', function () {
  var theme = [
    'theme/assets/*',
    'theme/config/*',
    'theme/layout/*',
    'theme/locales/*',
    'theme/snippets/*',
    'theme/templates/*',
    'theme/templates/customers/*'
  ];
  
  return gulp.src(theme, {base: "."})
    .pipe(zip('Bootstrapify_' + pjson.version + '.zip'))
    .pipe(gulp.dest('./'));
});

// SHOPIFY_THEME_SETTINGS: - we have two ways of creating theme settings:
//    (1) Concatenating json files to create a settings_schema.json (new way)
//    (2) Using the grunt plugin to create settings.html (old way)
//  Unfortunately this means we have two settings configs to maintain separately so we are just using the new way
//  but still leaving the old way intact for now incase we need it at some point.
//  If you wish to switch between the two all you need to do is comment out the new way and comment in the old way.
//  It's all set up so it should just work.

// SHOPIFY_THEME_SETTINGS (1): Create settings_schema.json
gulp.task('shopify_theme_settings', function () {
  
  // list of settings files to include, in order of inclusion
  var settings = [
    'welcome',
    'general',
    'layout',
    'navigation',
    'homepage',
    'homepage_banner',
    //'homepage_featured_collections',
    //'homepage_featured_products',
    //'homepage_page_content',
    'advanced'
  ];
  
  return gulp.src('./settings_schema/*.json')
    .pipe(jsoncombine('settings_schema.json', function(data){
      // collect the json data and store it in the correct order
      var data_array = [];
      for (var i = 0; i < settings.length; i++) {
        var file = settings[i];
        data_array.push(data[file]);
      }
      
      return new Buffer(JSON.stringify(data_array));
    }))
    .pipe(gulp.dest('./theme/config/'));
});

/*
  Grunt tasks - this is the config for running grunt tasks from inside gulp
*/

// SHOPIFY_THEME_SETTINGS (2): Create settings.html - this can be removed when Shopify _fully_ rolls out the new theme editor!
/*
gulp.task('shopify_theme_settings', function () {
  return gulp.run('grunt-shopify_theme_settings');
});
*/

// JS_MODERNIZR: Run the grunt task for modernizr
gulp.task('js_modernizr', function () {
  return gulp.run('grunt-modernizr');
});