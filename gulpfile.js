var gulp        = require('gulp'),
  gutil         = require('gulp-util'),
  zip           = require('gulp-zip'),
  plumber       = require('gulp-plumber'),
  jshint        = require('gulp-jshint'),
  concat        = require('gulp-concat'),
  pjson         = require('./package.json'),
  SassImport    = require('./utils/sass_import.js');

require('gulp-grunt')(gulp);

var onError = function (err) {
  gutil.beep();
  gutil.log(gutil.colors.red(err));
};

/* Default watch tasks for ease of development */
gulp.task('default', function () {
  gulp.watch(['./src/scss/*.scss', './src/scss/*.scss.liquid'], ['concat_sass']);
  gulp.watch(['./src/js/*.js'], ['lint']);
  gulp.watch('./settings/*.yml', ['shopify_theme_settings']);
});

/* ALL THE TASKS!!! */
gulp.task('build', ['lint', 'concat_sass', 'shopify_theme_settings', 'assets', 'zip']);

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

/* Copy all of the JS files to the theme assets. Maintain a list of paths to the src files here. All JS dependancies */
gulp.task('js_assets', function () {
  // List of js files to be copied
  var files = [
    './src/js/*.js',
    './bower_components/jquery/dist/jquery.min.*',
    './bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js', // One minified file that contains everything is SOOO much better than multiple requests!
  ];
  
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
  return gulp.run('grunt-shopify_theme_settings');
});