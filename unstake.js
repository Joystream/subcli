const { post, calls, runtime, runtimeUp, secretStore, setNodeUri, ss58Encode } = require('oo7-substrate')
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

setNodeUri(['ws://127.0.0.1:9944/']) // default
// 'wss://substrate-rpc.parity.io/' - CharredCherry

async function main () {
  await runtimeUp

  let index = 0
  const intentions = await runtime.staking.intentions
  const validator = intentions.find((accountId, ix) => {
    if (secretStore().find(accountId)) {
      index = ix
      return true
    }

    return false
  })

  if (!validator) {
    console.log('account is not a validator')
    process.exit()
  }

  console.log('Unstaking', index, ss58Encode(validator))

  try {
    post({
      sender: DefaultAccount,
      call: calls.staking.unstake(index)
    }).tie(console.log)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
