Polkadot Types
==============

oo7 types live in `types.js`, polkadot types in `ptypes.js`. They're copied
over from the app, but are typescript there - so to convert them, `package.json`
now also depends on typescript.

Update Types
------------

1. Copy `path/to/app/etc/types.ts` to `ptypes.ts`
1. Run typescript compiler, e.g.: `$ yarn run tsc ptypes.ts`
1. Commit updated `ptypes.ts` and `ptypes.js`
