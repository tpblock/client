var Web3 = require('./web3');
var numeric = require('./patch_numeric');
var Api = require('./patch_api');

const eosjs = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');

function TPOS(opts) {
    const { TextDecoder, TextEncoder } = require('util');

    var _opts = { ...opts };

    if (_opts.keyPrefix)
        numeric.prefix = _opts.keyPrefix;

    if (!_opts.textDecoder)
        _opts.textDecoder = new TextDecoder();

    if (!_opts.textEncoder)
        _opts.textEncoder = new TextEncoder();

    if (!_opts.signatureProvider && _opts.keyProvider) {
        var keyProvider = _opts.keyProvider;
        delete _opts.keyProvider;

        if (!Array.isArray(keyProvider))
            keyProvider = [keyProvider];

        _opts.signatureProvider = new JsSignatureProvider(keyProvider);
    }

    _opts.httpEndpoint = _opts.httpEndpoint.replace(/\/*$/, '');
    var web3 = new Web3(_opts.httpEndpoint + "/v1/eth");

    _opts.rpc = new eosjs.JsonRpc(_opts.httpEndpoint, { fetch });
    delete _opts.httpEndpoint;

    var api = new eosjs.Api(_opts);

    for (var k in web3)
        api[k] = web3[k];

    return api;
}

for (var n in eosjs)
    TPOS[n] = eosjs[n];

TPOS.ecc = require('eosjs/dist/eosjs-ecc-migration').ecc;

module.exports = TPOS;
