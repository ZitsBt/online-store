var gulp         = require('gulp'),
    browserSync  = require('browser-sync').create(),
    sass         = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("src/sass/**/*.sass")
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions'], {cascade: true}))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', function() {

  browserSync.init({
    server: "src",
    notify: false
  });

  gulp.watch("src/sass/**/*.sass", gulp.parallel('sass'));
  gulp.watch("src/*.html").on('change', browserSync.reload);
  gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('sass', 'serve'));

