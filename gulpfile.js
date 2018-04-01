"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************
var gulp        = require("gulp"),
    browserify  = require("browserify"),
    tsify       = require("tsify"),
    source      = require("vinyl-source-stream"),
    buffer      = require("vinyl-buffer"),
    tslint      = require("gulp-tslint"),
    tsc         = require("gulp-typescript"),
    sourcemaps  = require("gulp-sourcemaps"),
    uglify      = require("gulp-uglify"),
    runSequence = require("run-sequence"),
    browserSync = require('browser-sync').create(),
    KarmaServer = require('karma').Server,
    run         = require('gulp-run');

//******************************************************************************
//* LINT
//******************************************************************************
gulp.task("lint", function() {

    var config =  { formatter: "verbose", emitError: (process.env.CI) ? true : false };
    
    return gulp.src([
        "src/**/**.ts",
        "src/**/**.tsx",
        "test/**/**.test.ts"
    ])
    .pipe(tslint(config))
    .pipe(tslint.report());

});

//******************************************************************************
//* BUILD TEST
//******************************************************************************
var tsTestProject = tsc.createProject("tsconfig.json");

gulp.task("build-test", function() {
    return gulp.src([
            "src/**/**.ts",
            "src/**/**.tsx",
            "test/**/**.test.ts",
            "typings/main.d.ts/",
            "src/interfaces/interfaces.d.ts"],
            { base: "." }
        )
        .pipe(tsTestProject())
        .on("error", function (err) {
            process.exit(1);
        })
        .js
        .pipe(gulp.dest("."));
});

//******************************************************************************
//* TEST
//******************************************************************************
gulp.task("test", function(done) {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

//******************************************************************************
//* BUILD DEV
//******************************************************************************
gulp.task("build", function() {
    return run('node build.js').exec();
});

//******************************************************************************
//* DEV SERVER
//******************************************************************************
gulp.task("watch", ["default"], function () {
    
    browserSync.init({
        server: "."
    });
    
    gulp.watch([ "src/**/**.ts", "test/**/*.ts"], ["default"]);
    gulp.watch("dist/*.js").on('change', browserSync.reload); 
});

//******************************************************************************
//* DEFAULT
//******************************************************************************
gulp.task("default", function (cb) {
    runSequence("lint", "build-test", "test", "build", cb);
});