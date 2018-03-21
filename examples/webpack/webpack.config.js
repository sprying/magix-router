const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {

  devtool: 'inline-source-map',

  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'app.js')
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = entry
    }

    return entries
  }, {}),

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, '__build__'),
    publicPath: '__build__'
  },

  resolve: {
    alias: {
      'magix-router': path.join(__dirname, '../..', 'src'),
      custom: path.resolve(__dirname, 'custom/'),
    }
  },

  module: {
    rules: [
      {
        test: /\.(?:mx|js)$/, // js or mx 后缀
        include: [
          path.resolve(__dirname, 'custom'),//只处理app目录
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
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  // Expose __dirname to allow automatically setting basename.
  context: __dirname,
  node: {
    __dirname: true
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'shared',
      filename: 'shared.js'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}
