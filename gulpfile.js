var gulp = require('gulp'),
	concat = require('gulp-concat'),
	subtree = require('gulp-subtree'),
	clean = require('gulp-clean'),
	rename = require('gulp-rename'),
	runSequence = require('run-sequence'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	streamify = require('gulp-streamify');

// Directories
var SRC = './src/',
	BUILD = './build/',
	DIST = './dist/',
	BOWER = './bower_components/';

var languages = [
	'markdown',
	'gfm',

	// Syntax highlighting
	'clike',
	'css',
	'htmlmixed',
	'javascript',
	'lua',
	'xml',
];

var addons = [
	"display/fullscreen", // Fullscreen support
	'edit/continuelist', // Nicer lists
	'mode/overlay',	 // Required for GFM
	"comment/comment",

	"display/placeholder", // Pretty placeholder

	// Useful for code blocks
	"edit/closebrackets",
	"edit/closetag",

	// Find and replace
	"dialog/dialog",
	"scroll/annotatescrollbar",
	"search/matchesonscrollbar",
	"search/search",
	"search/searchcursor",
];

gulp.task('dist-clean', function() {
	return gulp.src(DIST).pipe(clean());
});

gulp.task('copyFiles', function() {
	return gulp.src([
			SRC + '**/*.css',
			SRC + '**/*.js',
			SRC + 'index.html',
		])
		.pipe(gulp.dest(DIST));
});

gulp.task('packagecss', function() {
	var files = [
		BOWER + 'codemirror/lib/codemirror.css',
		SRC + 'css/mirrormark.css',
		SRC + 'css/preview.css',
	];
	[].push.apply(files, addons.map(function(path) {
		return BOWER + "codemirror/addon/" + path + ".css";
	}));

	return gulp.src(files)
		.pipe(concat('mirrormark.package.css'))
		.pipe(gulp.dest(DIST + 'css'));
});

gulp.task('packagejs', function() {
	var files = [
		BOWER + 'codemirror/lib/codemirror.js',

		// Preview
		BOWER + 'pagedown-extra/pagedown/Markdown.Converter.js',
		BOWER + 'pagedown-extra/Markdown.Extra.js',

		SRC + 'js/mirrormark.js',
		SRC + 'js/preview.js',
	];
	[].push.apply(files, languages.map(function(path) {
		return BOWER + "codemirror/mode/" + path + "/" + path + ".js";
	}));
	[].push.apply(files, addons.map(function(path) {
		return BOWER + "codemirror/addon/" + path + ".js";
	}));

	return gulp.src(files)
		.pipe(concat('mirrormark.package.js'))
		.pipe(gulp.dest(DIST + 'js'));
});

gulp.task('minifycss', function() {
	return gulp.src([
			DIST + 'css/demo.css',
			DIST + 'css/codemirror.css',
			DIST + 'css/mirrormark.css',
			DIST + 'css/mirrormark.package.css'
		])
		.pipe(minifycss())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(DIST + 'css'));
});

gulp.task('minifyjs', function() {
	return gulp.src(DIST + 'js/*.js')
		.pipe(streamify(uglify()))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(DIST + 'js'));
});


/**
 * Master Tasks
 **/
gulp.task('build', function(callback) {
	// runSequence runs tasks in sequence to keep things straight forward
	return runSequence('dist-clean', 'copyFiles', ['packagecss', 'packagejs'], ['minifycss', 'minifyjs'], callback);
});


// Just build it
gulp.task('default', ['build']);

// Deploy to GH pages
gulp.task('temp', ['build'], function() {
	return gulp.src(DIST + '/**/*')
		.pipe(gulp.dest(BUILD));
});

gulp.task('deploy', ['temp'], function() {
	return gulp.src(BUILD)
		.pipe(subtree())
		.pipe(clean());
});
