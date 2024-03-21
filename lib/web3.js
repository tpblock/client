var util = require('util');

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