const { runtimeUp, setNodeUri } = require('oo7-substrate')
const getStatusUpdate = require('./getstatus')

setNodeUri(['ws://127.0.0.1:9944/'])

require('./types').register()

async function main () {
  await runtimeUp

  const status = await getStatusUpdate()
  console.log(status)
  process.exit(0)
}

main()
