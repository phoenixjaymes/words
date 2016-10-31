/* 
 * File   : gulpfile.js
 * Date   : 22 Sep 16
 * Author : Jaymes Young-Liebgott
 */

"use strict";

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
     del = require('del'),
    uglifyCss = require('gulp-uglifycss'),
  browserSync = require('browser-sync').create();


// Concatenate JS files
gulp.task("concatScripts", function() {
  return gulp.src([
    'app/app.module.js',
    'app/main.js',
    'app/directives.js',
    'app/words.service.js'
  ])
      .pipe(maps.init())
      .pipe(concat('app.js'))
      .pipe(maps.write('./'))
      .pipe(gulp.dest('app'));
});


// Concatenate JS files for watching with browserSync
gulp.task('watchJs', ['concatScripts'], function(done) {
  browserSync.reload();
  done();
});


// Minify JS scripts
gulp.task('minifyScripts', ['concatScripts'], function() {
  return gulp.src('app/app.js')
      .pipe(uglify())
      .pipe(rename('app.min.js'))
      .pipe(gulp.dest('app'));
});


// Compile Sass
gulp.task('compileSass', function() {
  return gulp.src('assets/scss/styles.scss')
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('assets/css'));
});


// Complie Sass files for watching with browserSync
gulp.task('watchSass', ['compileSass'], function() {
  return gulp.src('assets/css/styles.css')
      .pipe(browserSync.stream());
});


// MInify Styles
gulp.task('minifyStyles', ['compileSass'], function() {
  return gulp.src('assets/css/styles.css')
      .pipe(uglifyCss())
      .pipe(rename('styles.min.css'))
      .pipe(gulp.dest('assets/css'));
});


// Start server and watch files
gulp.task("serve", function() {
  browserSync.init({
      proxy: "http://localhost/words/"
    });
    
  gulp.watch('assets/scss/**/*.scss', ['watchSass']);
  gulp.watch('app/app.js', ['watchJs']);
    
});


// Clean up files
gulp.task('clean', function() {
  del([
    'dist',
    'assets/css/styles*.css*',
    'app/app.js',
    'app/app.js.map',
    'app/app.min.js'
  ]);
});


// Build 
gulp.task('build', ['concatScripts', 'minifyStyles'], function() {
  return gulp.src([
    'index.html',
    'assets/css/styles.min.css',
    'assets/img/**',
    'app/app.js',
    'app/views/**',
    'mock/*.html',
    'node_modules/angular/angular.min.js'
  ], {base: './'})
      .pipe(gulp.dest('dist'));
});


// Default task
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});