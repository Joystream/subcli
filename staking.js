const { runtime, runtimeUp, setNodeUri } = require('oo7-substrate')
const { ss58Encode } = require('oo7-substrate')

setNodeUri(['ws://127.0.0.1:9944/'])
require('./types').register()

async function main () {
  await runtimeUp

  await printStakingInfo()
  process.exit(0)
}

async function printStakingInfo () {
  // Validators
  const validators = await runtime.session.validators

  console.log('Validators')
  validators.forEach(function (accountId, i) {
    console.log(i, ss58Encode(accountId))
  })

  console.log('Intentions:')
  const intentions = await runtime.staking.intentions
  intentions.forEach(function (accountId, i) {
    console.log(i, ss58Encode(accountId))
  })
}

main()
