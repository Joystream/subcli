const { post, calls, runtime, system, chain, runtimeUp, secretStore, setNodeUri } = require('oo7-substrate')
const { Balance } = require('oo7-substrate')

setNodeUri(['ws://127.0.0.1:9944/'])

require('./types').register()

const BN = require('bn.js')

async function main () {
  await runtimeUp

  const [name, version, peers, system_name] = await Promise.all([system.chain, system.version, system.peers, system.name])
  console.log(name, version, system_name)
  console.log('peers:', peers.length)

  const [runtimeSpecName, implName] = await Promise.all([runtime.version.specName, runtime.version.implName])
  console.log('Runtime Spec name:', runtimeSpecName)
  console.log('Runtime Implementation:', implName)

  const [height] = await Promise.all([chain.height])
  console.log('block height', height.valueOf())

  // Council
  let council = await runtime.council.activeCouncil
  console.log('council size:', council.length)

  // Election
  let electionStage = await runtime.election.stage
  electionStage = electionStage.value == 0 ? 'No Election Running' : electionStage.option
  console.log('Election stage:', electionStage)

  // Validators
  const validators = await runtime.session.validators
  console.log('Validators:', validators.length)
  const authorities = await runtime.core.authorities
  console.log('Authorities:', authorities.length)

  if (validators.length > 0) {
    let balances = await Promise.all(validators.map(validator => runtime.balances.balance(validator)))
    console.log('Balances:', balances.join(', '))

    // WhyTF does this not work!?!?!
    // let total = validators.reduce( function(prev, current) {
    //   return (new Balance(prev)).add(new Balance(current))
    // }, new Balance(0));

    let total = sumOfBalances(balances)

    console.log('Validators total Balance:', total)
  }
}

function sumOfBalances (balances) {
  let total = 0
  for (let i in balances) {
    total += balances[i]
  }
  return total
}

main()
