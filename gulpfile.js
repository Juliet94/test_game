const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require("sass"));
const sync = require("browser-sync").create();
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const del = require("del");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("public/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'public'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

exports.default = gulp.series(
  styles, server, watcher
);

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("public"));
}

// Images

const images = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("public/img"))
}

exports.images = images;

// Copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.{jpg,png,svg}",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("public"))
  done();
}

exports.copy = copy;

// Clean

const clean = () => {
  return del("public");
};

// Reload

const reload = done => {
  sync.reload();
  done();
}

// Build

const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    copy,
    images,
  ));

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    copy,
  ),
  gulp.series(
    server,
    watcher
  ));
