const Web3EthAbi = require('web3-eth-abi');
const rlp = require("@ethersproject/rlp");
var Api = require('eosjs/dist/eosjs-api').Api;
var ser = require('eosjs/dist/eosjs-serialize');

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

const eth_abi = Uint8Array.from([
    14, 101, 111, 115, 105, 111, 58, 58, 97, 98, 105, 47, 49, 46, 48, 0, 1, 0, 0, 1, 4, 100,
    97, 116, 97, 5, 98, 121, 116, 101, 115, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
])
function eth_transact(transaction, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.broadcast, broadcast = _c === void 0 ? true : _c, _d = _b.sign, sign = _d === void 0 ? true : _d, readOnlyTrx = _b.readOnlyTrx, returnFailureTraces = _b.returnFailureTraces, requiredKeys = _b.requiredKeys, compression = _b.compression, blocksBehind = _b.blocksBehind, useLastIrreversible = _b.useLastIrreversible, expireSeconds = _b.expireSeconds;
    return __awaiter(this, void 0, void 0, function () {
        var info, abis, _e, serializedTransaction, serializedContextFreeData, pushTransactionArgs, availableKeys;
        var _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (typeof blocksBehind === 'number' && useLastIrreversible) {
                        throw new Error('Use either blocksBehind or useLastIrreversible');
                    }
                    if (!!this.chainId) return [3 /*break*/, 2];
                    return [4 /*yield*/, this.rpc.get_info()];
                case 1:
                    info = _g.sent();
                    this.chainId = info.chain_id;
                    _g.label = 2;
                case 2:
                    if (!((typeof blocksBehind === 'number' || useLastIrreversible) && expireSeconds)) return [3 /*break*/, 4];
                    return [4 /*yield*/, this.generateTapos(info, transaction, blocksBehind, useLastIrreversible, expireSeconds)];
                case 3:
                    transaction = _g.sent();
                    _g.label = 4;
                case 4:
                    if (!this.hasRequiredTaposFields(transaction)) {
                        throw new Error('Required configuration or TAPOS fields are not present');
                    }
                    _g.label = 5;
                case 5:
                    abis = [{
                        "accountName": transaction.account,
                        "abi": eth_abi
                    }]
                    _e = [__assign({}, transaction)];
                    _f = {};
                    return [4 /*yield*/, this.serializeTransactionExtensions(transaction)];
                case 6:
                    _f.transaction_extensions = _g.sent();
                    return [4 /*yield*/, this.serializeActions(transaction.context_free_actions || [])];
                case 7:
                    _f.context_free_actions = _g.sent();
                    return [4 /*yield*/, this.serializeActions(transaction.actions)];
                case 8:
                    transaction = __assign.apply(void 0, _e.concat([(_f.actions = _g.sent(), _f)]));
                    transaction = this.deleteTransactionExtensionObjects(transaction);
                    serializedTransaction = this.serializeTransaction(transaction);
                    serializedContextFreeData = this.serializeContextFreeData(transaction.context_free_data);
                    pushTransactionArgs = {
                        serializedTransaction: serializedTransaction,
                        serializedContextFreeData: serializedContextFreeData,
                        signatures: []
                    };
                    if (!sign) return [3 /*break*/, 13];
                    if (!!requiredKeys) return [3 /*break*/, 11];
                    return [4 /*yield*/, this.signatureProvider.getAvailableKeys()];
                case 9:
                    availableKeys = _g.sent();
                    return [4 /*yield*/, this.authorityProvider.getRequiredKeys({ transaction: transaction, availableKeys: availableKeys })];
                case 10:
                    requiredKeys = _g.sent();
                    _g.label = 11;
                case 11: return [4 /*yield*/, this.signatureProvider.sign({
                    chainId: this.chainId,
                    requiredKeys: requiredKeys,
                    serializedTransaction: serializedTransaction,
                    serializedContextFreeData: serializedContextFreeData,
                    abis: abis,
                })];
                case 12:
                    pushTransactionArgs = _g.sent();
                    _g.label = 13;
                case 13:
                    if (broadcast) {
                        if (compression) {
                            return [2 /*return*/, this.pushCompressedSignedTransaction(pushTransactionArgs, readOnlyTrx, returnFailureTraces)];
                        }
                        return [2 /*return*/, this.pushSignedTransaction(pushTransactionArgs, readOnlyTrx, returnFailureTraces)];
                    }
                    return [2 /*return*/, pushTransactionArgs];
            }
        });
    });
};

var transact = Api.prototype.transact;
Api.prototype.transact = function (trans, opts) {
    console.log(trans.actions[0]);
    if (trans.actions.length != 1 || !trans.actions[0].solidity)
        return transact.call(this, trans, opts);

    var act = trans.actions[0];
    var solidity = act.solidity;

    var _func;

    for (var f = 0; f < solidity.length; f++) {
        var func = solidity[f];
        if (func.type == 'function' && func.name == act.name) {
            _func = func;
            break;
        }
    }

    if (!_func)
        throw new Error('Unknown action ' + act.name + ' in contract ' + act.account);

    if (act.data && _func.inputs.length !== act.data.length)
        throw new Error('Invalid parameters for action ' + act.name + ' in contract ' + act.account);

    var params = act.data || [];

    var data = Web3EthAbi.encodeFunctionCall(_func, params).slice(2);
    act.data = { data };
    act.name = '';
    act.abi = _func;

    return new Promise((resolve, reject) => {
        eth_transact.call(this, trans, opts)
            .then(result => {
                var act = trans.actions[0];
                var act_result = result.processed.action_traces[0];

                if (act_result.console.length) {
                    var hex_logs = "0x" + act_result.console;
                    try {
                        act_result.logs = rlp.decode(hex_logs);
                    } catch (e) { }
                }

                if (act.abi.outputs.length && act_result.return_value_hex_data.length) {
                    var hex_data = "0x" + act_result.return_value_hex_data;
                    try {
                        act_result.return_value = Web3EthAbi.decodeParameter(act.abi.outputs[0], hex_data);
                    } catch (e) { }
                }

                return resolve(result);
            })
            .catch(reject);
    });
}

Api.prototype.addr2name = function (addr) {
    var buffer = new ser.SerialBuffer();
    buffer.pushArray(Buffer.from(addr.substr(26), 'hex').reverse());
    return buffer.getName();
}

Api.prototype.name2addr = function (name) {
    var buffer = new ser.SerialBuffer();
    buffer.pushName(name);
    return "0x000000000000000000000000" + ser.arrayToHex(buffer.asUint8Array().reverse());
}
