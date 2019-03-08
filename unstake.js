const env = require('./env')
const { post, calls, runtime, runtimeUp, secretStore, ss58Encode } = require('oo7-substrate')

async function main () {
  await runtimeUp

  let index = 0
  const intentions = await runtime.staking.intentions
  const validator = intentions.find((accountId, ix) => {
    if (ss58Encode(env.Account) === secretStore().find(accountId).address) {
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
      sender: env.Account,
      call: calls.staking.unstake(index)
    }).tie(console.log)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
