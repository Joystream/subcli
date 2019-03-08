const { post, calls, runtimeUp, runtime, ss58Encode } = require('oo7-substrate')
const env = require('./env')
const assert = require('assert')
const fs = require('fs')

async function set(code) {
  await runtimeUp
  const sudoKey = await runtime.sudo.key

  if (ss58Encode(sudoKey) !== ss58Encode(env.Account)) {
    console.log('Account is not sudo!')
    process.exit(1)
  }

  post({
    sender: env.Account,
    call: calls.sudo.sudo(calls.consensus.setCode(code))
  }).tie(console.log)
}

const data = fs.readFileSync(process.argv[2])
const code = new Uint8Array(data)

set(code)
