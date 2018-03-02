'use strict'
let ts = require('typescript')
let autoprefixer = require('autoprefixer')
let postcss = require('postcss')
let srcFolder = 'examples' // source folder
let buildFolder = 'build' // build folder
let config = {
  debug: true,
  tmplFolder: srcFolder,
  srcFolder: buildFolder,
  loaderType: 'cmd',
  cssSelectorPrefix: '',
  addTmplViewsToDependencies: true,
  tmplArtEngine: true,
  scopedCss: [
    'examples/app/assets/_cube.less',
    'examples/app/assets/_normalize.less',
    'examples/app/assets/_icons.less',
    'examples/app/assets/_util.less',
    'examples/app/assets/_btn.less',
    'examples/app/assets/_loading.less',
    'examples/app/assets/layout.less'
  ],
  compileTmplCommand(content) {
    var str = ts.transpileModule(content, {
      compilerOptions: {
        lib: ['es7'],
        target: 'es3',
        module: ts.ModuleKind.None
      }
    })
    str = str.outputText
    return str
  },
  compileJSStart(content, from) {
    var str = ts.transpileModule(content, {
      compilerOptions: {
        lib: ['es7'],
        target: 'es3',
        module: ts.ModuleKind.None
      }
    })
    str = str.outputText
    return str
  },
  compileCSSEnd(css) {
    return new Promise((resolve, reject) => {
      postcss(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })).process(css).then(res => {
        resolve(res.css)
      }).catch(ex => {
        reject(ex)
      })
    })
  },
  customTagProcessor (tagInfo) {
    const tags = {
      'router-link': function (args) {
        return `<span mx-view="app/plugins/link" view-content="${args.content}" view-cls="${args.cls}" view-to="${args.to}"></span>`
      },
      'router-view': function (args) {
        return '<div mx-view="app/plugins/view"></div>'
      }
    }
    if (tags[tagInfo.tag]) {
      var parsedAttrs = {}

      if (tagInfo.attrs) {
        var pairs = tagInfo.attrs.trim().split(/\s/)
        pairs.forEach(function (item) {
          var pair = item.split('=')
          parsedAttrs[pair[0]] = pair[1].replace(/"/g, '')
        })
      }
      parsedAttrs.content = tagInfo.content
      var tagTmpl = tags[tagInfo.tag](parsedAttrs)
      return tagTmpl
    }
  }
}

module.exports = config
