var gulp        = require('gulp'),
  gutil         = require('gulp-util'),
  zip           = require('gulp-zip'),
  plumber       = require('gulp-plumber'),
  jshint        = require('gulp-jshint'),
  uglify        = require('gulp-uglify'),
  concat        = require('gulp-concat'),
  jsoncombine   = require('gulp-jsoncombine'),
  rename        = require('gulp-rename'),
  pjson         = require('./package.json'),
  SassImport    = require('./utils/sass_import.js');

require('gulp-grunt')(gulp);

var onError = function (err) {
  gutil.beep();
  gutil.log(gutil.colors.red(err));
};

/* Default watch tasks for ease of development */
gulp.task('default', function () {
  gulp.watch(['./src/scss/*.scss', './src/scss/*.scss.liquid', './src/scss/*/*.scss.liquid'], ['concat_sass']);
  gulp.watch(['./src/js/*.js'], ['lint', 'modernizr', 'js_minify']);
  gulp.watch('./settings/*.json', ['shopify_theme_settings']); // gulp.watch('./settings/*.yml', ['shopify_theme_settings']);
});

/* ALL THE TASKS!!! */
gulp.task('build', ['lint', 'modernizr', 'js_minify', 'concat_sass', 'shopify_theme_settings', 'assets', 'zip']);

/* Helper task for moving all asset dependancies to the theme assets folder */
gulp.task('assets', ['js_assets']);

/* Pull our scss files together and move them into the themes assets */
gulp.task('concat_sass', function () {
  var paths = new SassImport('./src/scss/styles.scss');
  return gulp.src(paths)
    .pipe(concat('styles.scss.liquid'))
    .pipe(gulp.dest('./theme/assets/'));
});

/* Check we are not doing silly stuff with our JS and then move the files to theme assets. Our own JS specific */
gulp.task('lint', function () {
  return gulp.src('./src/js/*.js')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('./theme/assets/'));
});

/* Minify our own js files and move them to the theme assets. */
gulp.task('js_minify', function () {
  return gulp.src('./src/js/*.js')
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./theme/assets/'));
});

/* Copy all of the JS files to the theme assets. Maintain a list of paths to the src files here. All JS dependancies */
gulp.task('js_assets', function () {
  // List of js files to be copied
  var files = [
    './src/js/*.js',
    './bower_components/jquery/dist/jquery.min.*',
    './bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js', // One minified file that contains everything is SOOO much better than multiple requests!
    './bower_components/respond/cross-domain/respond-proxy.html',
    './bower_components/respond/dest/respond.min.js',
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

/* Run the grunt task for generating the theme settings */
/* NOTE: this can be removed when Shopify fully rolls out the new theme editor! */
gulp.task('shopify_theme_settings', function () {
  // list of settings files to include in order of inclusion
  var settings = [
    'welcome',
    'general',
    'layout',
    'navigation',
    'homepage',
    'homepage_slider',
    'homepage_featured_collections',
    'homepage_featured_products',
    'homepage_page_content'
  ];
  
  return gulp.src('./settings/*.json')
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
    
//   return gulp.run('grunt-shopify_theme_settings');
});

/* Run the grunt task for modernizr */
gulp.task('modernizr', function () {
  return gulp.run('grunt-modernizr');
});