const { post, calls, runtimeUp, ss58Decode } = require('oo7-substrate')
const env = require('./env')

async function transfer (to, amount) {
  await runtimeUp

  try {
    // let recipient = runtime.indices.ss58Decode(to)
    let recipient = ss58Decode(to)
    post({
      sender: env.Account,
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

const Recipient = process.argv[2] // node this-script.js recipient amount
const TransferAmount = parseInt(process.argv[3])

if (TransferAmount > 0) {
  transfer(Recipient, TransferAmount)
} else {
  process.exit(1)
}
