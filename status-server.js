const { runtimeUp, setNodeUri } = require('oo7-substrate')
const getStatusUpdate = require('./getstatus')
const express = require('express')
const sleepSeconds = require('./sleep')

setNodeUri(['ws://127.0.0.1:9944/'])

require('./types').register()

const app = express()

var STATUS = {}

async function main () {
  await runtimeUp

  while (true) {
    STATUS = await getStatusUpdate()
    await sleepSeconds(6)
  }
}

main()

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(STATUS))
})

const server = app.listen(8081, function () {
  const host = server.address().address
  const port = server.address().port
  console.log('Status server listening at http://%s:%s', host, port)
})
