# @tpblock/client
[![NPM version](https://img.shields.io/npm/v/@tpblock/client?style=flat-square)](https://www.npmjs.com/package/@tpblock/client)

General purpose library for TPOS blockchain clients.

## Installation
```bash
npm install @tpblock/client
```

## Usage
```js
const CHAIN = require('@tpblock/client');
chain = CHAIN({
	chainId: config["chainId"],
	keyProvider: keyProvider,
	httpEndpoint: config["bios_httpEndpoint"],
	logger: {
		log: null,
		error: null
	},
});
```

## Test
```bash
npm test
```
