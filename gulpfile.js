const fs = require('fs');
const { src, dest, watch } = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();

const views = () => {
  return src(['./app/index.pug', './app/chat.pug'])
    .pipe(pug({
        pretty: true,
    }))
    .pipe(dest('./build'))
}

const styles = () => {
  return src('./app/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(dest('./build'))
    .pipe(browserSync.stream());
}

const images = () => {
  return src(['./app/images/*.svg','./app/images/*.jpg'])
    .pipe(dest('./build/images'))
}

exports.build = (cb) => {
  const exists = fs.existsSync('./build');

  if (exists) {
    fs.rmdirSync('./build', { force: true, recursive: true });
  }
  
  fs.mkdirSync('./build');

  styles();
  images();
  views();

  cb();
}

exports.default = () => {
  const exists = fs.existsSync('./build');

  if (exists) {
    fs.rmdirSync('./build', { force: true, recursive: true });
  }

  fs.mkdirSync('./build');

  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });

  watch('./app/styles/*.scss', { ignoreInitial: false }, styles);
  watch('./app/*.pug', { ignoreInitial: false }, views).on('change', browserSync.reload);
  watch('./app/images/*', { ignoreInitial: false }, images).on('change', browserSync.reload);
}