"use strict";
const gulp = require("gulp");
const sass = require("gulp-sass");
const jsonImporter = require("node-sass-json-importer");

const autoprefixer = require("gulp-autoprefixer");
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();
const notify = require("gulp-notify");

const responsive = require("gulp-responsive");
const imagemin = require("gulp-imagemin");

const reload = browserSync.reload;
const del = require("del");

const config = {
	src: {
		root: "./src",
		sass: ["./src/sass/**/app.scss", "./src/sass/**/loader.scss"],
		pug: "./src/pug/**/index.pug",
		js: "./src/js/**/*.js",
		img: "./src/img/**/*"
	},
	dest: {
		root: "./build",
		css: "./build/css",
		js: "./build/js",
		img: "./build/img"
	}
};

// Compile sass files to css and import variables from json
gulp.task("sass", function() {
	return gulp
		.src(config.src.sass)
		.pipe(
			sass({
				importer: jsonImporter,
				outputStyle: "expanded",
				indentType: "tab",
				indentWidth: "1"
			}).on("error", sass.logError)
		)
		.pipe(
			autoprefixer({
				browsers: ["last 15 versions"],
				cascade: false
			})
		)
		.pipe(gulp.dest(config.dest.css))
		.pipe(browserSync.reload({ stream: true }));
});

// Compile pug files to html
gulp.task("pug", () => {
	return gulp
		.src(config.src.pug)
		.pipe(
			pug({
				pretty: "\t"
			})
		)
		.on(
			"error",
			notify.onError(function(error) {
				return {
					title: "Pug",
					message: error.message
				};
			})
		)
		.pipe(gulp.dest(config.dest.root));
});

gulp.task("js", function() {
	gulp.src(config.src.js).pipe(gulp.dest(config.dest.js));
});

// Resize and minify images
gulp.task("images", function() {
	return gulp
		.src(config.src.img)
		.pipe(
			responsive(
				{
					"*": {
						height: 200
					}
				},
				{
					quality: 70,
					progressive: true,
					compressionLevel: 6,
					withMetadata: false,
					withoutEnlargement: true,
					errorOnEnlargement: false,
					silent: true,
					stats: true
				}
			)
		)
		.pipe(imagemin())
		.pipe(gulp.dest(config.dest.img));
});

gulp.task("browser-sync", ["sass", "pug", "js"], function() {
	browserSync.init({
		server: {
			baseDir: config.dest.root
		}
	});
});

// Watch files compiling
gulp.task("watch", function() {
	gulp.watch(config.src.sass, ["sass"]);
	gulp.watch(config.src.pug, ["pug"]);
	gulp.watch(config.dest.root + "/*.html").on("change", reload);
	gulp.watch(config.src.js, ["js"]);
	gulp.watch(config.dest.js + "/*.js").on("change", reload);
});

gulp.task("default", ["watch", "browser-sync"]);

// Build
gulp.task("build", ["removedist", "sass", "pug", "js", "images"]);

gulp.task("removedist", function() {
	return del.sync(config.dest.root);
});
