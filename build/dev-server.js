require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()

// Mock Data
// const appData = require('../data.json')
// const novels = appData.novels
// const flag = appData.flag
// const http = require('http')

// 请求接口 解决跨域
const web = require('../src/api/server')
const apiRoutes = express.Router()

apiRoutes.get('/bookshelf', function(req, res){
  web.getApi('bookshelf', 'mFP43SIHeHWEAJecoMa5Y8aL').then((response) => {
    res.send(response)
  })
})
apiRoutes.get('/user', function(req, res){
  web.getApi('detail-info', 'mFP43SIHeHWEAJecoMa5Y8aL').then((response) => {
    res.send(response)
  })
})
apiRoutes.get('/auto-complete', function(req, res){
  web.getQuery(req.query.query).then((response) => {
    res.send(response)
  })
})
apiRoutes.get('/source-list', function(req, res){
  web.getSource(req.query.book).then((response) => {
    res.send(response)
  })
})
apiRoutes.get('/chapters', function(req, res){
  web.getChapters(req.query.id).then((response) => {
    res.send(response)
  })
})
apiRoutes.get('/content', function(req, res){
  web.getContent(req.query.uri).then((response) => {
    res.send(response)
  })
})

app.use('/api', apiRoutes)

var compiler = webpack(webpackConfig)
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
