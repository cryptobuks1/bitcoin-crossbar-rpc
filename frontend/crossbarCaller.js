var autobahn = require('autobahn');

var connection, ul;

var url = 'ws://127.0.0.1:8080/ws'
var realm = 'realm1'

// name of the registered microservice on crossbar
var appName = 'com.myapp.bitcoin'

$('body').terminal(
   //Interpreter
   function (command, term) {

      // connect to crossbar
      if (command === "start") {
         return start(term)
      }
      // disconnect from crossbar
      if (command === "exit") {
         if (connection && connection.isOpen && connection.session && connection.session.isOpen) {
            connection.close()
            term.error("Disconnected")
            return;
         }
      }
      var cmdsArr = command.split(" ");

      // console.log(command)

      // before we call rpc make sure we are connected
      if (connection && connection.isOpen && connection.session && connection.session.isOpen) {
         // make sure command is supported 
         if (callspec[cmdsArr[0]]) {
            connection.session.call(appName, cmdsArr)
               .catch(err => {
                  term.error(JSON.stringify(err, null, 2))
                  // console.log("Can't connect to the microservice: ", err);
               })
               .then(res => {
                  if (res.err) {
                     term.error(JSON.stringify(res.err, null, 2))
                  } else {
                     // console.log(command + ": " + res.result);
                     if (typeof res.result !== "object")
                        term.echo(res.result)
                     else
                        term.echo(JSON.stringify(res.result, null, 2))
                  }
               })
         } else {
            term.error(`Command [${command}] not found`)

         }
      } else {
         term.error("Not connected, type 'start' to connect:")
      }
   }, {
      // Options
      greetings: "Welcome to Bitcoin RPC Terminal. \nPress 'start' to initiate connection to bitcoin crossbar server:",
      // prepare autocomplete
      onInit: function (term) {
         var wrapper = term.cmd().find('.cursor').wrap('<span/>').parent()
            .addClass('cmd-wrapper');
         ul = $('<ul></ul>').appendTo(wrapper);
         ul.on('click', 'li', function () {
            term.insert($(this).text());
            ul.empty();
         });
      },
      // handle autocomplete
      keydown: function (e) {
         var term = this;
         // setTimeout because terminal is adding characters in keypress
         // we use keydown because we need to prevent default action for
         // tab and still execute custom code
         setTimeout(function () {
            ul.empty();
            var command = term.get_command();
            var name = command.match(/^([^\s]*)/)[0];
            if (name) {
               var word = term.before_cursor(true);
               var regex = new RegExp('^' + $.terminal.escape_regex(word));
               var list;
               if (name == word) {
                  list = Object.keys(callspec);
               } else if (command.match(/\s/)) {
                  if (callspec[name]) {
                     if (word.match(/^--/)) {
                        list = callspec[name].options.map(function (option) {
                           return '--' + option;
                        });
                     } else {
                        list = callspec[name].args;
                     }
                  }
               }
               if (word.length >= 2 && list) {
                  var matched = [];
                  for (var i = list.length; i--;) {
                     if (regex.test(list[i])) {
                        matched.push(list[i]);
                     }
                  }
                  var insert = false;
                  if (e.which == 9) {
                     insert = term.complete(matched);
                  }
                  if (matched.length && !insert) {
                     ul.hide();
                     for (var i = 0; i < matched.length; ++i) {
                        var str = matched[i].replace(regex, '');
                        $('<li>' + str + '</li>').appendTo(ul);
                     }
                     ul.show();
                  }
               }
            }
         }, 0);
         if (e.which == 9) {
            return false;
         }
      }
   });

// connect to crossbar router
var start = function (term) {
   if (connection && connection.isOpen && connection.session && connection.session.isOpen) {
      term.error("Already connected")
      return;
   }
   term.echo('Connecting to crossbar server...')
   term.pause()
   connection = new autobahn.Connection({
      url: url,
      realm: realm,
   })
   connection.open()

   connection.onopen = function () {
      term.resume()
      term.echo("Successfully connected. \nTo disconnect type 'exit'.")
      term.echo("Type 'help' to see a list of all available commands")
   };

   connection.onclose = function (reason, details) {
      
      // user must have typed "exit"
      if(reason === "closed")
         return
      // console.log("reason:" + reason)
      // console.log("details:" + JSON.stringify(details, null, 2))
      term.resume()
      term.error("Could not connect to : " + url)
      // let's not auto reconnect
      if (connection.isRetrying)
         connection.close()
   };

   // if we can't connect to a crossbar server within 3 sec => throw timeout error
   setTimeout(function () {
      if (!connection.isOpen) {
         term.resume()
         term.error("Connection timeout.")
         connection.close()
      }
   }, 3000);
}

// list of all commands
var callspec = {
   test: "test", // used to test backend, backend should return an error
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