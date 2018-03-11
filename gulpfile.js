var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var preprocess = require('gulp-preprocess');
var ngConstant = require('gulp-ng-constant');
var bump = require('gulp-bump');
var merge2 = require('merge2');

// 'platforms/ios/www/app/**/*.js', 'platforms/ios/www/app/**/*.html',
var paths = {
  sass: ['./scss/**/*', './www/app/**/*.sass'],
  preprocess: ['www/*', 'www/js/**/*', 'www/app/*', 'www/app/**/*']
};

gulp.task('constants', getConstants);

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  console.log('running SASS!!!');
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);

  // gulp.src(['./scss/ionic.app.scss', './scss/*.sass', './www/app/**/*.sass'])
  //   .pipe(sass())
  //   .pipe(concat('sass-files.sass'))
  //   .pipe(gulp.dest('./www/css/'))
  //   .pipe(minifyCss({
  //     keepSpecialComments: 0
  //   }))
  //   .pipe(rename({ extname: '.min.css' }))
  //   .pipe(gulp.dest('./www/css/'))
  //   .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.preprocess, ['development']);
});

gulp.task('watch-production', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.preprocess, ['emulator-production']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('development', function (done) {
  console.log('---- running gulp development ----');
  gulp.src(["www/js/*", "www/js/**/*", "www/app/**/*"])
    .pipe(preprocess({context: { NODE_ENV: 'development'}})) //To set environment variables in-line
    .pipe(gulp.dest('www/dist'));

  gulp.src(["www/og_index.html"])
    .pipe(preprocess({context: { NODE_ENV: 'development'}})) //To set environment variables in-line
    .pipe(rename("index.html"))
    .pipe(gulp.dest('www'));

  getConstants('./www/dist');

  done();
});

gulp.task('production', function (done) {
  gulp.src('./bower.json')
    .pipe(bump())
    .pipe(gulp.dest('./'));

  // ["ios", "android/assets"].forEach(function(platform) {

  //   gulp.src(["platforms/"+platform+"/www/js/*", "platforms/"+platform+"/www/js/**/*", "platforms/"+platform+"/www/app/**/*"])
  //     .pipe(preprocess({context: { NODE_ENV: 'production'}})) //To set environment variables in-line
  //     .pipe(gulp.dest('platforms/'+platform+'/www/dist'));

  //   gulp.src(["platforms/"+platform+"/www/og_index.html"])
  //     .pipe(preprocess({context: { NODE_ENV: 'production'}})) //To set environment variables in-line
  //     .pipe(rename("index.html"))
  //     .pipe(gulp.dest('platforms/'+platform+'/www/'));

  //   getConstants('platforms/'+platform+'/www/dist');

  // });
  gulp.src(["www/js/*", "www/js/**/*", "www/app/**/*"])
    .pipe(preprocess({context: { NODE_ENV: 'production'}})) //To set environment variables in-line
    .pipe(gulp.dest('www/dist'));

  gulp.src(["www/og_index.html"])
    .pipe(preprocess({context: { NODE_ENV: 'production'}})) //To set environment variables in-line
    .pipe(rename("index.html"))
    .pipe(gulp.dest('www'));

  getConstants('./www/dist');

  done();
});

gulp.task('minify-production', function(done) {
  return merge2(
    gulp.src(["www/js/*", "www/js/**/*", "www/app/**/*"])
      .pipe(preprocess({context: { NODE_ENV: 'production'}})) //To set environment variables in-line
      .pipe(gulp.dest('www/dist')),
    gulp.src(["www/og_index.html"])
      .pipe(preprocess({context: { NODE_ENV: 'production'}})) //To set environment variables in-line
      .pipe(rename("index.html"))
      .pipe(gulp.dest('www'))
  );
})

gulp.task('emulator-production', ['minify-production'], function (done) {

  ["ios", "android/assets"].forEach(function(platform) {
    gulp.src(["www/dist/*", "www/dist/**/*"])
      .pipe(gulp.dest('platforms/'+platform+'/www/dist'));
    gulp.src("www/*")
      .pipe(gulp.dest('platforms/'+platform+'/www'));

    getConstants('platforms/'+platform+'/www/dist');

  });

  done();
});

gulp.task('serve:before', ['sass','watch']);
gulp.task('emulate:before', ['sass','watch-production']);

function getConstants(destination) {
  // get version from bower file
  var bower = require('./bower.json');
  // set version to ng contants
  var constants = { VERSION: bower.version };

  return ngConstant({
    constants: constants,
    stream: true,
    name: 'app.constants'
  })
    // save ngConstant.js to src/app/
    .pipe(gulp.dest(destination));
}

