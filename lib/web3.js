var crypto = require('crypto');
var base64 = require('base64');
var util = require('util');

var secp256k1 = require("secp256k1");
secp256k1.ecdsaSign = function ecdsaSign(msg32, seckey) {
    var sk = crypto.ECKey.from({
        "kty": "EC",
        "crv": "secp256k1",
        "d": base64.encode(seckey)
    });

    var sig = sk.sign(msg32, {
        recoverable: true
    });

    var res = {
        signature: sig.slice(0, 64),
        recid: sig[64]
    };

    return res;
}

secp256k1.ecdsaRecover = function ecdsaRecover(sig, recid, msg32) {
    var pk = crypto.ECKey.recover(msg32, Buffer.concat([sig, Buffer.from([recid])]));
    var res = Uint8Array.from(base64.decode(pk.json({ compress: true }).x));

    return res;
};

function wrap_async_func(mod, cb = false) {
    for (var k in mod) {
        var m = mod[k];
        if (cb && typeof m === 'function')
            mod[k + '_sync'] = util.sync(m, false);
        else if (m && m.request)
            mod[k + '_sync'] = util.sync(m, true);
    }
}

var core = require('web3-core');
var Eth = require('web3-eth');
var utils = require('web3-utils');

var Web3 = function Web3() {
    var _this = this;
    // sets _requestmanager etc
    core.packageInit(this, arguments);
    this.utils = utils;
    this.eth = new Eth(this);
    this.eth.ens.registryAddress = "0000000000000000000000000000000000000000";

    wrap_async_func(this.eth);
    wrap_async_func(this.eth.net);

    this.eth.accounts.signTransaction_sync = util.sync(this.eth.accounts.signTransaction, true);
};

core.addProviders(Web3);
Web3.providers.HttpProvider = require('./http_provider');

module.exports = Web3;