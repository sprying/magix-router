'use strict'

let mat = require('mat')
const combineTool = require('magix-combine')
const combineToolConfig = require('./combine-tool-config')
const magixAnalyse = require('mat-magix-analyse')
const rewriteTypes = require('mat-rewrite-types')

combineTool.config(combineToolConfig)

mat.env({
  port: '8080',
  timeout: 10 * 1000 //请求的过期时间
})

const jsPatterns = [/\.js(\?.+)?$/]
const indexPatterns = [/^(\/(\?.+)?|\/index.html(\?.+)?)$/]

mat.task('pushState', function () {
  mat.url([/^((?!\.(css|less|js|html|ico|swf)).)*$/])
  .rewrite([
    [/(\/.*)+/, '/examples/cmd-seajs/index.html']
  ])
})

/**
 * 本地mat服务器对接rap模拟接口数据
 */
mat.task('default', ['pushState'], () => {
  mat.url(jsPatterns)
  .rewrite([
    function (url) {
      console.log(url)
      if (url === '/dist/magix-router.js') return url
      return '/examples' + url
    },
    function (url) {
      return rewriteTypes(url, ['.mx'])
    }
  ])
  .use(magixAnalyse(combineTool))
})
