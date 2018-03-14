/**
 * Created by sprying.fang@gmail.com on 13/03/2018.
 */
const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '__build__')
  },
  resolve: {
    alias: {
      'magix-router': path.join(__dirname, '../..', 'src'),
      src: path.resolve(__dirname, 'src/'),
    }
  },
  module: {
    rules: [{
      test: /\.(?:mx|js)$/, // js or mx 后缀
      include: [
        path.resolve(__dirname, 'src/views'),//只处理app目录
      ],
      use: [{
        loader: 'magix-loader',
        options: {//编译器配置项，magix-loader 使用 magix-combine,这里是magix-combine的配置项 https://github.com/thx/magix-combine/issues/17
          loaderType: 'module',
          useAtPathConverter: false,
          addViewAnalyze: function (path) {
            // 针对页面。对应的html也要做分析
            // if (/app\/pages/.test(path)) {
            // 	return path.replace('js', 'html')
            // }
          },
          // 针对内容，对于 defaultview 做特殊处理
          addViewRequire: function (content) {
            let reg = /defaultView\s*:\s*\\?("[^"]*"|'[^']*'|[^'">\s]*)/
            let match = content.match(reg)
            if (match && match[1]) {
              let view = match[1].replace(/'|"|\\/g, '')
              return [view]
            } else {
              return []
            }
          }
        }
      }]
    }, {
      test: /\.js$/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  plugins: [
		function () {
			var maps = {}
			this.plugin('compilation', function (compilation) {
				var mainTemplate = compilation.mainTemplate;
				mainTemplate.plugin('require-extensions', function (source, chunk) {
					var moduleString = []
					var idString = []
          chunk.modules.forEach(function (mod) {
            var rawRequest = mod.rawRequest
            var newRequest = rawRequest
            // 针对cell的模块这里需要加上版本号
            if(/^@ali\/cell/.test(newRequest)){
              // 获取版本号
              var match = mod.userRequest.match(/(\@\d+\.\d+\.\d+)@@ali/)
              if(match && match[1]){
                newRequest = newRequest + match[1]
              }
              // 留一个不带版本号的作为backup
              if(!new RegExp(rawRequest).test(moduleString.join('|'))){
                moduleString.push('"' + rawRequest + '":"' + mod.id + '"')
              }
            }

						moduleString.push('"' + newRequest + '":"' + mod.id + '"')
						idString.push('"' + mod.id + '":"' + newRequest + '"')
					})

					return this.asString([
						'var moduleMaps = {' + moduleString.join(',') + '}',
						'var idMaps = {' + idString.join(',') + '}',
						'var __old___webpack_require__ = __webpack_require__',
						'__webpack_require__ = function(moduleId){',
						'var __exports = __old___webpack_require__(moduleId)',
						'__exports.__moduleid__ = idMaps[moduleId]',
						'return __exports',
						'}',
						"window.require = function(name){ return __webpack_require__(moduleMaps[name])}",
						source
					])
				})
			})
		},
		// 版本号直接清空
		new webpack.NormalModuleReplacementPlugin(/\@\d+\.\d+\.\d+/, function (resource) {
			if(!/@ali\/cell/.test(resource.request)) return
			resource.request = resource.request.replace(/\@\d+\.\d+\.\d+/, '');
		}),
		new webpack.NoEmitOnErrorsPlugin()
  ]
}
