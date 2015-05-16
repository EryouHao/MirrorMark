var gulp = require('gulp'),
	del = require('del'),                  // Used to clean files
	rename = require('gulp-rename'),       // Used to rename *.* to *.min.*
	runSequence = require('run-sequence'), // Don't release files before cleaning
	subtree = require('gulp-subtree'),     // Used to commit to gh-pages
	shell = require('gulp-shell'),

	// Javascript
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),

	// Styles
	less = require('gulp-less'),
	minifycss = require('gulp-minify-css');


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

gulp.task('clean', function (cb) {
  del(DIST + "**/*", cb);
});

gulp.task('copy', function() {
	return gulp.src([
			SRC + '**/*.css',
			SRC + 'index.html',
		]).pipe(gulp.dest(DIST));
});

gulp.task('css:less', function() {
	return gulp.src(SRC + 'css/mirrormark.less')
    .pipe(less({
      paths: [ BOWER ]
    }))
    .pipe(gulp.dest(DIST + 'css'));
})

gulp.task('css:package', ['css:less'], function() {
	var files = [
		BOWER + 'codemirror/lib/codemirror.css',
		DIST + 'css/mirrormark.css',
	];
	[].push.apply(files, addons.map(function(path) {
		return BOWER + "codemirror/addon/" + path + ".css";
	}));

	return gulp.src(files)
		.pipe(concat('mirrormark.package.css'))
		.pipe(gulp.dest(DIST + 'css'));
});

gulp.task('css:minify', ['css:package'], function() {
	return gulp.src([
			DIST + 'css/mirrormark.css',
			DIST + 'css/mirrormark.package.css'
		])
		.pipe(minifycss())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(DIST + 'css'));
});

/**
 * Combine to produce the MirrorMark sources
 */
gulp.task('js:combine', function() {
	return gulp.src( [
		SRC + 'js/preview.js',
		SRC + 'js/mirrormark.js',
	])
		.pipe(concat('mirrormark.js'))
		.pipe(gulp.dest(DIST + 'js'));
});

/**
 * Combine all files together
 */
gulp.task('js:package', function() {
	var files = [
		BOWER + 'codemirror/lib/codemirror.js',

		// Preview
		BOWER + 'pagedown-extra/pagedown/Markdown.Converter.js',
		BOWER + 'pagedown-extra/Markdown.Extra.js',
		SRC + 'js/preview.js',

		SRC + 'js/mirrormark.js',
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

/**
 * Minify everything
 */
gulp.task('js:minify', ['js:package', 'js:combine'], function() {
	return gulp.src([
		DIST + 'js/mirrormark.js',
		DIST + 'js/mirrormark.package.js'
	])
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(DIST + 'js'));
});


gulp.task('js', ['js:combine', 'js:package', 'js:minify']);
gulp.task('css', ['css:package', 'css:minify']);

gulp.task('build', function(callback) {
	// We should clean before anything else, everything else doesn't matter
	return runSequence('clean', 'copy', 'js', 'css', callback);
});

// Just build it
gulp.task('default', ['build']);

// Commit dist
gulp.task('release', ['build'], shell.task([
	'git ls-files -z dist | xargs -0 git update-index --no-assume-unchanged',
	'git add dist',
	'git commit -m "Distribution"',
	'git ls-files -z dist | xargs -0 git update-index --assume-unchanged',
]));

gulp.task('deploy', ['release'], function() {
	return gulp.src(DIST).pipe(subtree({
      remote: 'origin',
      branch: 'gh-pages',
      message: 'Distribution',
	}));
});
