var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  sass = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglifyjs'),
  cssnano = require('gulp-cssnano'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  cache = require('gulp-cache');

gulp.task('sass', function () {
  return gulp.src("src/sass/**/*.sass")
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions'], { cascade: true }))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
  return gulp.src('src/js/app.js')
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'));
});

gulp.task('css-min', function () {
  return gulp.src([
    'src/css/main.css',
    'src/css/normalize.css'
  ])
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

gulp.task('clean', function () {
  return gulp.src('dist/', { read: false })
    .pipe(clean());
});

gulp.task('clear', function () {
  return cache.clearAll()
});

gulp.task('img', function () {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{ removeVievBox: false }],
      une: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('serve', function () {

  browserSync.init({
    server: "src",
    notify: false
  });

  gulp.watch("src/sass/**/*.sass", gulp.series('sass', 'css-min'));
  gulp.watch("src/*.html").on('change', browserSync.reload);
  gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('sass', 'css-min', 'scripts', 'serve'));

gulp.task('build', function () {
  var buildCss = gulp.src('src/css/main.css')
    .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));

  return buildCss, buildFonts, buildJs, buildHtml;

});

gulp.task('builder', gulp.series('clean', 'img', 'build'));