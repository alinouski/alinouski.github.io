const http = require('http')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const config = require('../webpack.config')

const root = path.resolve(__dirname, '..')
const port = Number(process.env.PORT || 8080)
const host = process.env.HOST || '127.0.0.1'

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
}

function sendFile(res, filePath) {
  fs.readFile(filePath, function (error, content) {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Not found')
      return
    }

    res.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
    })
    res.end(content)
  })
}

function requestHandler(req, res) {
  const requestPath = decodeURIComponent(req.url.split('?')[0])
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '')
  const filePath = path.resolve(root, relativePath)

  if (!filePath.startsWith(root)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Forbidden')
    return
  }

  fs.stat(filePath, function (error, stats) {
    if (!error && stats.isFile()) {
      sendFile(res, filePath)
      return
    }

    sendFile(res, path.join(root, 'index.html'))
  })
}

const compiler = webpack(config)

compiler.watch({}, function (error, stats) {
  if (error) {
    console.error(error)
    return
  }

  const info = stats.toString({
    colors: true,
    chunks: false,
    children: false,
    modules: false
  })

  console.log(info)
})

http.createServer(requestHandler).listen(port, host, function () {
  console.log('Dev server running at http://' + host + ':' + port + '/')
})
