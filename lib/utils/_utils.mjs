// import from node modules
import {render, html, svg} from 'uhtml'

const areSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value))

const debounce = (f, delay) => {
  let timer = 0;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => f.apply(this, args), delay);
  }
}

// local import
import clone from './clone.mjs'

const compose = (...fns) => {
  return arg => fns.reduce((acc, fn) => {
    return fn(acc);
  }, arg)
}

import convert from './convert.mjs'

import {copyToClipboard} from './copyToClipboard.mjs'

import {dataURLtoBlob} from './dataURLtoBlob.mjs'

import here from './here.mjs'

import {default as hexa} from './hexa.mjs'

import loadPlugins from './loadPlugins.mjs'

import mapboxGeometryFunction from './mapboxGeometryFunction.mjs'

import getCurrentPosition from './getCurrentPosition.mjs'

import merge from './merge.mjs'

import paramString from './paramString.mjs'

import promiseAll from './promiseAll.mjs'

import queryParams from './queryParams.mjs'

import style from './style.mjs'

import * as svgSymbols from './svgSymbols.mjs'

import vectorSource from './vectorSource.js'

import {default as verticeGeoms} from './verticeGeoms.mjs'

import xhr from './xhr.mjs'

export default {
  render,
  html,
  svg,
  convert,
  areSetsEqual,
  clone,
  compose,
  copyToClipboard,
  dataURLtoBlob,
  debounce,
  getCurrentPosition,
  here,
  hexa,
  loadPlugins,
  mapboxGeometryFunction,
  merge,
  paramString,
  promiseAll,
  queryParams,
  style,
  svgSymbols,
  vectorSource,
  verticeGeoms,
  xhr,
}