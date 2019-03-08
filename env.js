const { secretStore, setNodeUri, ss58Encode } = require('oo7-substrate')
const assert = require('assert')
const path = require('path')

// load env variables from .env.local into process.env
try {
  require('dotenv').config({
    path: path.resolve(process.cwd(), '.env.local')
  })
} catch (e) {}

/*
$ subkey restore Alice
Seed 0x416c696365202020202020202020202020202020202020202020202020202020 is account:
  Public key (hex): 0xd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f
  Address (SS58): 5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ
*/
const Alice = '0x416c696365202020202020202020202020202020202020202020202020202020'

const AccountSeed = process.env.SUB_ACCOUNT_SEED || Alice

const Account = secretStore().submit(AccountSeed, 'Default')

assert(secretStore().find(Account))

setNodeUri([process.env.SUB_HOST || 'ws://127.0.0.1:9944/']) // default

module.exports = {
  Account
}
