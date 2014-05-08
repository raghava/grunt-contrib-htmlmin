/*
 * grunt-contrib-htmlmin
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Sindre Sorhus, contributors
 * Licensed under the MIT license.
 */

'use strict';
var chalk = require('chalk');
var prettyBytes = require('pretty-bytes');
var minify = require('html-minifier').minify;

module.exports = function (grunt) {
  grunt.registerMultiTask('htmlmin', 'Minify HTML', function () {
    var options = this.options();

    this.files.forEach(function (file) {
      var min;

      file.src.forEach(function(src){
        var dest = file.dest;
        if(grunt.file.isDir(dest)){
          dest = dest + '/' + (function (fileName) {
            if (fileName.indexOf('/') > -1) {
              var filePathArr = fileName.split('/');
              return filePathArr[ filePathArr.length - 1];
            }
            return fileName;
          })(src);
        }

        if (!grunt.file.exists(src || ' ')) {
          return grunt.log.warn('Source file "' + chalk.cyan(src) + '" not found.');
        }

        var max = grunt.file.read(src);

        try {
          min = minify(max, options);
        } catch (err) {
          return grunt.warn(file.src + '\n' + err);
        }

        if (min.length < 1) {
          grunt.log.warn('Destination not written because minified HTML was empty.');
        } else {
          grunt.file.write(dest, min);
          grunt.log.writeln('Minified ' + chalk.cyan(dest) + ' ' + prettyBytes(max.length) + ' → ' + prettyBytes(min.length));
        }
      });
    });
  });
};