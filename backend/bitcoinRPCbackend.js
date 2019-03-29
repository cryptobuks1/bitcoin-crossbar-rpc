// setup libraries
var autobahn = require('autobahn');
var RpcClient = require('bitcoind-rpc');

console.log("Running AutobahnJS " + autobahn.version);

// setup crossbar router
url = 'ws://127.0.0.1:8080/ws';
realm = 'realm1';

// setup bitcoind (localhost)
var rpcusername = 'username'
var rpcpassword = 'password'
var rpcport = '8332'
var host = '127.0.0.1'

var connection = new autobahn.Connection({
    url: url,
    realm: realm
});

// fire this code when we got a session
connection.onopen = function (session, details) {
    console.log("session open!", details);

    function utcnow() {
        console.log("Someone is calling com.myapp.bitcoin");
        now = new Date();
        return now.toISOString();
    }

    //setup config file, send RPC request and wait for response
    async function sendRPCrequest(command) {
        console.log("command:")
        console.log(command)

        if (callspec[command[0]] == undefined)
            return {
                err: `RPC command [${command}] not supported`
            }

        var config = {
            protocol: 'http',
            user: rpcusername,
            pass: rpcpassword,
            host: rpcport,
            port: host,
        };
        try {
            let res = await callRPC(command, config)
            return res
        } catch (error) {
            console.log(error)
            return {
                err: error
            }
        }
    };

    //call RPC and return a promise
    function callRPC(cmd, cfg) {
        let rpc = new RpcClient(cfg);
        let params = (cmd.length === 1) ? [] : cmd.slice(1)

        // I hate to do this ugly if/else statements
        // but have no other choice since it would require changing bitcore-rpc library

        // handle call with 2+ params
        if (params.length) {
            return new Promise(function (resolve, reject) {
                rpc[cmd[0]](params, function (err, res) {
                    console.log("err", err)
                    // console.log("res", res)
                    if (err) return reject(err);
                    resolve(res)
                })
            })
        }
        // handle call with only 1 param
        else {
            return new Promise(function (resolve, reject) {
                rpc[cmd[0]](function (err, res) {
                    console.log("err", err)
                    // console.log("res", res)
                    if (err) return reject(err);
                    resolve(res)
                })
            })
        }
    }

    // register our function on crossbar.io
    session.register('com.myapp.bitcoin', sendRPCrequest).then(
        function (registration) {
            console.log("Procedure registered:", registration.id);
        },
        function (error) {
            console.log("Registration failed:", error);
        }
    );
};

// fire this code when our session has gone
connection.onclose = function (reason, details) {
    console.log("session closed: " + reason, details);
}

// Don't forget to actually trigger the opening of the connection!
connection.open();

var callspec = {
    abandontransaction: 'abandonTransaction',
    addmultisigaddress: 'addMultiSigAddress',
    addnode: 'addNode',
    backupwallet: 'backupWallet',
    createmultiSig: 'createMultiSig',
    createrawtransaction: 'createRawTransaction',
    decoderawtransaction: 'decodeRawTransaction',
    dumpprivKey: 'dumpPrivKey',
    encryptwallet: 'encryptWallet',
    estimatefee: 'estimateFee',
    estimatesmartfee: 'estimateSmartFee',
    estimatepriority: 'estimatePriority',
    generate: 'generate',
    generatetoaddress: 'generateToAddress',
    getaccount: 'getAccount',
    getaccountaddress: 'getAccountAddress',
    getaddednodeinfo: 'getAddedNodeInfo',
    getaddressmempool: 'getAddressMempool',
    getaddressutxos: 'getAddressUtxos',
    getaddressbalance: 'getAddressBalance',
    getaddressdeltas: 'getAddressDeltas',
    getaddresstxids: 'getAddressTxids',
    getaddressesbyaccount: 'getAddressesByAccount',
    getbalance: 'getBalance',
    getbestblockhash: 'getBestBlockHash',
    getblockdeltas: 'getBlockDeltas',
    getblock: 'getBlock',
    getblockchaininfo: 'getBlockchainInfo',
    getblockcount: 'getBlockCount',
    getblockhashes: 'getBlockHashes',
    getblockhash: 'getBlockHash',
    getblockheader: 'getBlockHeader',
    getblocknumber: 'getBlockNumber',
    getblocktemplate: 'getBlockTemplate',
    getconnectioncount: 'getConnectionCount',
    getchaintips: 'getChainTips',
    getdifficulty: 'getDifficulty',
    getgenerate: 'getGenerate',
    gethashespersec: 'getHashesPerSec',
    // getinfo: 'getInfo',
    getmemorypool: 'getMemoryPool',
    getmempoolentry: 'getMemPoolEntry',
    getmempoolinfo: 'getMemPoolInfo',
    getmininginfo: 'getMiningInfo',
    getnetworkinfo: 'getNetworkInfo',
    getnewaddress: 'getNewAddress',
    getpeerinfo: 'getPeerInfo',
    getrawmempool: 'getRawMemPool',
    getrawtransaction: 'getRawTransaction',
    getreceivedbyaccount: 'getReceivedByAccount',
    getreceivedbyaddress: 'getReceivedByAddress',
    getspentinfo: 'getSpentInfo',
    gettransaction: 'getTransaction',
    gettxout: 'getTxOut',
    gettxoutsetinfo: 'getTxOutSetInfo',
    getwalletinfo: 'getWalletInfo',
    getwork: 'getWork',
    help: 'help',
    importaddress: 'importAddress',
    importmulti: 'importMulti',
    importprivkey: 'importPrivKey',
    invalidateblock: 'invalidateBlock',
    keypoolrefill: 'keyPoolRefill',
    listaccounts: 'listAccounts',
    listaddressgroupings: 'listAddressGroupings',
    listreceivedbyaccount: 'ilistReceivedByAccount',
    listreceivedbyaddress: 'listReceivedByAddress',
    listsinceblock: 'listSinceBlock',
    listtransactions: 'listTransactions',
    listunspent: 'listUnspent',
    listlockunspent: 'listLockUnspent',
    lockunspent: 'lockUnspent',
    move: 'move',
    prioritisetransaction: 'prioritiseTransaction',
    sendfrom: 'sendFrom',
    sendmany: 'sendMany', //not sure if this will work
    sendrawtransaction: 'sendRawTransaction',
    sendtoaddress: 'sendToAddress',
    setaccount: 'setAccount',
    setgenerate: 'setGenerate',
    settxfee: 'setTxFee',
    signmessage: 'signMessage',
    signrawtransaction: 'signRawTransaction',
    stop: 'stop',
    submitblock: 'submitBlock',
    validateaddress: 'validateAddress',
    verifymessage: 'verifyMessage',
    walletlock: 'walletLock',
    walletpassphrase: 'walletPassPhrase',
    walletpassphrasechange: 'walletPassphraseChange',
};