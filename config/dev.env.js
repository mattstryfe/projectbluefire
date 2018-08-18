'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  butter_APIKey: 'f3f3a8fd2d801ee2d8ccb35a148ec200c7cb888a'
})
