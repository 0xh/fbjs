var gulp = require('gulp');
var babel = require('gulp-babel');
var flatten = require('gulp-flatten');
var del = require('del');
var runSequence = require('run-sequence');

var babelPluginDEV = require('./scripts/babel/dev-expression');
var babelPluginRequires = require('./scripts/babel/rewrite-requires');
var babelPluginFlowComments = require('babel-plugin-flow-comments');
var gulpModuleMap = require('./scripts/gulp/module-map.js');

var paths = {
  src: [
    'src/**/*.js',
    '!src/**/__tests__/**/*.js',
    '!src/**/__mocks__/**/*.js'
  ],
  lib: 'lib'
};

var babelOpts = {
  nonStandard: true,
  blacklist: [
    'flow',
    'spec.functionName'
  ],
  optional: [
    'es7.objectRestSpread',
    'es7.trailingFunctionCommas'
  ],
  plugins: [
    babelPluginDEV,
    babelPluginRequires,
    babelPluginFlowComments
  ],
  _moduleMap: {
    'es6-map': 'es6-map',
    'promise': 'promise',
    'whatwg-fetch': 'whatwg-fetch'
  }
};

var moduleMapOpts = {
  moduleMapFile: './module-map.json',
  prefix: 'fbjs/lib/'
};

gulp.task('clean', function(cb) {
  del(['lib/'], cb);
});

gulp.task('lib', function() {
  return gulp
    .src(paths.src)
    .pipe(gulpModuleMap(moduleMapOpts))
    .pipe(babel(babelOpts))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib));
});

gulp.task('watch', function() {
  gulp.watch(paths.src, ['lib']);
});

gulp.task('build', function(cb) {
  runSequence('clean', 'lib', cb);
});

gulp.task('default', ['build']);
