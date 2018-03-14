const express = require('express')
const rewrite = require('express-urlrewrite')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()

app.use(webpackDevMiddleware(webpack(WebpackConfig), {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

const fs = require('fs')
const path = require('path')


app.use(express.static(__dirname))

app.use('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
