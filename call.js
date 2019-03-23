'use strict';

// Import the API, Keyring and some utility functions
const { ApiPromise } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { stringToU8a } = require('@polkadot/util');

const { registerJoystreamTypes } = require('./ptypes');

function usage()
{
  console.log(`$ call.js seed module call [params...]

  Where:
    seed    Is a 32 hex character key seed.
    module  Is the name of the module (lowercase) you want to call.
    call    Is the name of the function (javaScriptCase) you want to call.
    params  Are all optional parameters you want to pass to the function.

  The script listens to and dumps events, so if your function emits them, you should
  see them.
  `);

  process.exit(-1);
}

async function main()
{
  var _1, _2, seed, module, call, rest;
  [_1, _2, seed, module, call, ...rest] = process.argv;

  if (!seed) {
    usage();
  }
  // console.log('_', _1);
  // console.log('_', _2);
  // console.log('seed', seed);
  // console.log('module', module);
  // console.log('call', call);
  // console.log('rest', rest);

  // First register Joystream types
  registerJoystreamTypes();

  // Create an instance of the keyring
  const keyring = new Keyring();

  // Add Alice to our keyring (with the known seed for the account)
  const key = keyring.addFromSeed(stringToU8a(seed));

  // Instantiate the API
  const api = await ApiPromise.create();

  // Listen to events
  api.query.system.events((events) => {
    console.log(`Number of events: ${events.length}`);
    events.forEach((record) => {
      // extract the phase, event and the event types
      const { event, phase } = record;
      const types = event.typeDef;

      // show what we are busy with
      console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
      console.log(`\t\t${event.meta.documentation.toString()}`);

      // loop through each of the parameters, displaying the type and data
      event.data.forEach((data, index) => {
        console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
      });
    });
  });

  // Run the thing.
  await api.tx[module]
    [call](...rest)
    .signAndSend(key)
}

main().catch(console.error).finally(_ => process.exit());
