'use strict';

var gulp = require('gulp'),
    debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    Config = require('./gulpfile.config'),
    exec = require('child_process'),
    compass = require('gulp-compass'),
    browserSync = require('browser-sync').create();

var config = new Config();

/**
 * Generates the app.d.ts references file dynamically from all application *.ts files.
 */
gulp.task('gen-ts-refs', function () {
    var target = gulp.src(config.appTypeScriptReferences);
    var sources = gulp.src([config.allTypeScript], {read: false});
    return target.pipe(inject(sources, {
        starttag: '//{',
        endtag: '//}',
        transform: function (filepath) {
            return '/// <reference path="../..' + filepath + '" />';
        }
    })).pipe(gulp.dest(config.typings));
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function () {
    return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', function () {
    var sourceTsFiles = ['src/ts/**/*.ts'];                //path to typescript files
                       //  config.libraryTypeScriptDefinitions, //reference to library .d.ts files
                       //  config.appTypeScriptReferences];     //reference to app.d.ts files

    var tsResult = gulp.src(sourceTsFiles)
                       .pipe(sourcemaps.init())
                       .pipe(tsc({
                           target: 'ES5',
                           module: 'AMD',
                           declarationFiles: false,
                           noExternalResolve: true
                       }));

        tsResult.dts.pipe(gulp.dest('out/js'));
        return tsResult.js
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest('out/js'));
});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function (cb) {
  var typeScriptGenFiles = [config.tsOutputPath,            // path to generated JS files
                            config.sourceApp +'**/*.js',    // path to all JS files auto gen'd by editor
                            config.sourceApp +'**/*.js.map' // path to all sourcemap files auto gen'd by editor
                           ];

  // delete the files
  del(typeScriptGenFiles, cb);
});


gulp.task('watch', function() {
    gulp.watch([config.allTypeScript], 
      ['ts-lint', 'compile-ts', 'gen-ts-refs']);
    gulp.watch('./src/scss/**/*.scss', ['compass']);
});

gulp.task('compass', function() {
    gulp.src('./src/scss/**/*.scss')
      .pipe(compass( { 
        config_file: './config.rb',
        css: 'out/stylesheets',
        sass: 'src/scss'
      }));
});

gulp.task('webserver', function() {
  browserSync.init({
    server: { baseDir: './out',
              host: '0.0.0.0' }
    });

  gulp.watch('out/**/*').on('change', browserSync.reload);
});

gulp.task('default', ['ts-lint', 'compile-ts', 'gen-ts-refs', 'compass', 'webserver', 'watch']);

