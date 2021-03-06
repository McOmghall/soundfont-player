/* global describe it AudioContext */
require('web-audio-test-api')
var assert = require('assert')
var fs = require('fs')
var path = require('path')
var load = require('audio-loader')
var Soundfont = require('..')

var piano = fs.readFileSync(path.join(__dirname, '../examples/acoustic_grand_piano-ogg.js'))

load.fetch = function (url) {
  load.fetch.url = url
  return Promise.resolve(piano.toString())
}

describe('Soundfont player', function () {
  describe('Load instruments', function () {
    it('returns a promise', function () {
      var ac = new AudioContext()
      assert.equal(typeof Soundfont.instrument(ac, 'piano').then, 'function')
    })
    it('loads mp3 by default', function () {
      var ac = new AudioContext()
      return Soundfont.instrument(ac, 'piano').then(function (piano) {
        assert.equal(piano.url,
          'http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/piano-mp3.js')
      })
    })
    it('the promise resolve to an instrument', function () {
      var ac = new AudioContext()
      return Soundfont.instrument(ac, 'piano')
      .then(function (piano) {
        assert(piano)
        assert.equal(piano.name, 'piano')
        assert.equal(typeof piano.play, 'function')
      })
    })
    it('options.nameToUrl', function () {
      var ac = new AudioContext()
      var toUrl = function (name) { return 'URL:' + name + '.js' }
      return Soundfont.instrument(ac, 'piano', { nameToUrl: toUrl }).then(function (piano) {
        assert.equal(piano.url, 'URL:piano.js')
      })
    })
  })
})
