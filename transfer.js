const { post, calls, runtime, runtimeUp, secretStore, setNodeUri } = require('oo7-substrate')
const path = require('path')

// load env variables from .env.local into process.env
try {
  require('dotenv').config({
    path: path.resolve(process.cwd(), '.env.local')
  })
} catch (e) {}

const AccountSeed = process.env.ACCOUNT_SEED

const DefaultAccount = secretStore().submit(AccountSeed, 'Default')
require('assert')(secretStore().find(DefaultAccount))

const Recipient = process.argv[2] // node this-script.js recipient amount
const TransferAmount = parseInt(process.argv[3])

setNodeUri(['ws://127.0.0.1:9944/']) // default
// 'wss://substrate-rpc.parity.io/' - CharredCherry

async function transfer (to, amount) {
  await runtimeUp

  try {
    let recipient = runtime.indices.ss58Decode(to)
    post({
      sender: DefaultAccount,
      call: calls.balances.transfer(recipient, amount)
    }).tie(function (status) {
      if (status.finalised) {
        console.log(status.finalised)
        process.exit(0)
      }
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

if (TransferAmount > 0) {
  transfer(Recipient, TransferAmount)
} else {
  process.exit(1)
}
