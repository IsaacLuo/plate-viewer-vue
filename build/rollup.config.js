var babel = require('rollup-plugin-babel')
var vue = require('rollup-plugin-vue')
var pkg = require('../package.json')

var banner = `/*
 * eagle.js v${pkg.version}
 *
 * @license
 * Copyright 2017, Zulko
 * Released under the ISC License
 */`

module.exports = {
  entry: 'src/main.js',
  dest: 'dist/plate-viewer.js',
  format: 'es',
  moduleName: 'plate-viewer.js',
  // external: [
  //   'highlight.js'
  // ],
  banner,
  plugins: [
    vue({
      css: 'dist/plate-viewer.css'
    }),
    babel()
  ]
}
