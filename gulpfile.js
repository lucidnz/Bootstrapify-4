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
  argv          = require('yargs').argv,
  gulpif        = require('gulp-if'),
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
    './src/js/*.js',
    './spec/*_spec.js'
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

// Clean the theme i.e. reset all settings data back to blank
gulp.task('clean', ['settings_clean']);

/*
  Tasks - This is where the heavy lifting is done
*/

// SASS_CONCAT: Pull our scss files together and move them into the themes assets
gulp.task('sass_concat', function () {
  var paths = new SassImport('./src/scss/styles.scss');
  return gulp.src(paths)
    .pipe(plumber({
      errorHandler: onError
    }))
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
    .pipe(gulpif(!argv.dev, gulp.dest('./theme/assets/')));
});

// JS_BROWSERIFY: Build our js files ready for use in the browser
gulp.task('js_browserify', function () {
  return browserify('./src/js/app.js', {
      debug: argv.dev, // to output source maps for easy debuging run task with --dev flag
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
    './bower_components/picturefill/dist/picturefill.min.js',
    './bower_components/html5shiv/dist/html5shiv.js'
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

// SHOPIFY_THEME_SETTINGS: Create settings_schema.json
gulp.task('shopify_theme_settings', function () {

  // list of settings files to include, in order of inclusion
  var settings = [
    'theme_info',
    'general',
    'colors',
    'layout',
    'navigation',
    'homepage',
    'homepage_banner',
    'collections',
    'products',
    'thumbnails',
    'footer',
    'social',
    'newsletter',
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

// SETTINGS_CLEAN: set the settings_data.json back to blank
gulp.task('settings_clean', function () {
  return gulp.src('./settings_data/settings_data.json')
    .pipe(gulp.dest('./theme/config/'));
});

/*
  Grunt tasks - this is the config for running grunt tasks from inside gulp
*/

// JS_MODERNIZR: Run the grunt task for modernizr
gulp.task('js_modernizr', function () {
  return gulp.run('grunt-modernizr');
});
