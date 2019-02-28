const { post, calls, runtime, system, chain, runtimeUp, secretStore, setNodeUri } = require('oo7-substrate')
const { Balance } = require('oo7-substrate')

setNodeUri(['ws://127.0.0.1:9944/'])

require('./types').register()

const BN = require('bn.js')

var STATUS = {}

function sleep(seconds) {
  return new Promise(function(resolve) {
    setTimeout(resolve, seconds * 1000)
  })
}

async function main () {
  await runtimeUp

  while (true) {
    await sleep(6)
    STATUS = await getStatusUpdate()
  }
}

async function getStatusUpdate() {
  let update = {}

  const [chain_name, version, peers, name] = await Promise.all([
    system.chain, system.version, system.peers, system.name
  ])

  update.system = {
    'chain': chain_name,
    name,
    version,
  }

  const [spec, impl] = await Promise.all([
    runtime.version.specName, runtime.version.implName
  ])

  update.runtime_version = {
    spec,
    impl,
  }

  const height = await chain.height
  update.block_height = height.valueOf()

  // Council + Election
  let council = await runtime.council.activeCouncil
  let electionStage = await runtime.election.stage
  electionStage = electionStage.value == 0 ? 'Not Running' : electionStage.option

  update.council = {
    members_count: council.length,
    election_stage: electionStage
  }

  // Validators
  const validators = await runtime.session.validators
  update.validators = {
    count: validators.length
  }
  //const authorities = await runtime.core.authorities
  //console.log('Authorities:', authorities.length)

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

main()

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(STATUS))
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})