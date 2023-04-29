var crypto = require('crypto');
var base64 = require('base64');
var util = require('util');
var vm = require('vm');

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

    console.trace(msg32.hex());
    console.error(res);

    return res;
}

secp256k1.ecdsaRecover = function ecdsaRecover(sig, recid, msg32) {
    var pk = crypto.ECKey.recover(msg32, Buffer.concat([sig, Buffer.from([recid])]));
    var res = Uint8Array.from(base64.decode(pk.json({ compress: true }).x));

    return res;
};

var sbox = new vm.SandBox();
sbox.addBuiltinModules();
sbox.add('http2', {
    constants: require('./http2_constants')
});
sbox.add("secp256k1", secp256k1);

var Web3 = sbox.require('web3', __dirname);

function wrap_async_func(mod, cb = false) {
    for (var k in mod) {
        var m = mod[k];
        if (cb && typeof m === 'function')
            mod[k + '_sync'] = util.sync(m, false);
        else if (m && m.request)
            mod[k + '_sync'] = util.sync(m, true);
    }
}

function Web3_wrap() {
    var web3 = new Web3(...arguments);

    wrap_async_func(web3.eth);
    wrap_async_func(web3.eth.net);
    wrap_async_func(web3.eth.ens, true);
    wrap_async_func(web3.shh);

    web3.eth.accounts.signTransaction_sync = util.sync(web3.eth.accounts.signTransaction, true);

    return web3;
}

for (var k in Web3)
    Web3_wrap[k] = Web3[k];

Web3_wrap.providers.HttpProvider = require('./http_provider');

module.exports = Web3_wrap;