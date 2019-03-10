const { runtime, system, chain } = require('oo7-substrate')

async function getStatusUpdate () {
  let update = {}

  const [chainName, version, peers, name] = await Promise.all([
    system.chain, system.version, system.peers, system.name
  ])

  update.system = {
    'chain': chainName,
    name,
    version,
    peerCount: peers.length
  }

  const [spec, impl, specVer] = await Promise.all([
    runtime.version.specName, runtime.version.implName, runtime.version.specVersion
  ])

  update.runtime_version = {
    spec,
    impl,
    specVer
  }

  const height = await chain.height
  update.block_height = height.valueOf()

  if (spec === 'joystream-node') {
    // Council + Election
    let council = await runtime.council.activeCouncil
    let electionStage = await runtime.election.stage
    electionStage = electionStage.value.valueOf() == 0 ? 'Not Running' : electionStage.option

    update.council = {
      members_count: council.length,
      election_stage: electionStage
    }
  }

  // Validators
  const validators = await runtime.session.validators
  update.validators = {
    count: validators.length
  }

  // const authorities = await runtime.core.authorities

  if (validators.length > 0) {
    let balances = await Promise.all(validators.map(validator => runtime.balances.balance(validator)))
    let total = sumOfBalances(balances)

    update.validators.total_stake = total
    // WhyTF does this not work!?!?!
    // let total = validators.reduce( function(prev, current) {
    //   return (new Balance(prev)).add(new Balance(current))
    // }, new Balance(0));
  }

  return update
}

function sumOfBalances (balances) {
  let total = 0
  for (let i in balances) {
    total += balances[i]
  }
  return total
}

module.exports = getStatusUpdate
