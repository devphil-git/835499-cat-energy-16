"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var del = require("del");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");

gulp.task("clean", function () {                        //очистка папки перед сборкой
  return del("build");
});

gulp.task("copy", function () {                         //копирование шрифтов, картинок и скриптов
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**",
      "source/js/**",
      "source/css/normalize.css"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("css-build", function () {                    //сборка CSS
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
});

gulp.task("images", function () {                       //Оптимизация картинок
  return gulp.src("build/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {                         //Создание webp картинок
  return gulp.src("build/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function () {                       //Создание SVG спрайта
  return gulp.src([
    "build/img/icon-*.svg",
    "build/img/htmlacademy.svg"
    ])
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {                         //Добавление спрайта в HTML
  return gulp.src("source/*.html")
    .pipe(posthtml([ include() ]))
    .pipe(gulp.dest("build"));
});

gulp.task("refresh", function (done) {                  //Обновление страницы
  server.reload();
  done();
});

gulp.task("server-build", function () {                 //запуск сервера
  server.init({
    server: "build/"
  });

  gulp.watch("source/less/**/*.less", gulp.series("css-build", "refresh"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});


gulp.task("build", gulp.series(                         //Запуск
  "clean",
  "copy",
  "css-build",
  "images",
  "webp",
  "sprite",
  "html",
  "server-build"
));
