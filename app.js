const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
var bip39 = require("bip39");
var hdkey = require('ethereumjs-wallet/hdkey');
const conm = require('./Locker_abi_bin.js');

const web3 = new (require("web3"));
web3.setProvider(new web3.providers.WebsocketProvider("ws://localhost:8545"));

app.use("/", express.static(__dirname + '/'));

var mnemonic_filename = "mnemonic.txt";

var mnemonic = fs.readFileSync(mnemonic_filename, {encoding: "utf-8"});
hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
var hd_derivation_path = "m/44'/60'/0'/0";

list = []
for(var i = 0; i < 4; i++) {
    var hdpath = hd_derivation_path + "/" + i;
    var wallet = hdwallet.derivePath(hdpath).getWallet();
    var addr = '0x' + wallet.getAddress().toString('hex');
    list[i] = addr
}

class locker {
    async startlockerSystem() {
        
        await this.execDeploy(list[0],list[1],list[2],list[3]);
        await this.connectSocket();

        http.listen(3000, () => {
            console.log('listen 3000');
        });
    }
    async execDeploy(pass0,pass1,pass2,pass3) {
        const locker = new web3.eth.Contract(conm.abi);
        const accounts = await web3.eth.getAccounts();
        locker.options.from = accounts[0];
        this.obj = await locker.deploy({data:conm.bin, arguments:[pass0,pass1,pass2,pass3]}).send({ gas:'5000000'});
        console.log("Contract deployed.");
    }
    async connectSocket() {
        io.sockets.on('connection', (socket) => {
            socket.on('call_openLocker', (msg) => {
                this.openLocker(socket,msg);
            });
            socket.emit('msg', 'connected!');
        });
    }
    async openLocker(sock,pass){
        const accounts = await web3.eth.getAccounts();
        var hdpath = hd_derivation_path + "/" + pass;
        var wallet = hdwallet.derivePath(hdpath).getWallet();
        var addr = '0x' + wallet.getAddress().toString('hex'); 
        var result = await this.obj.methods.openLocker(addr,pass).send({from:accounts[0], gas:'5000000'})
        this.getLog(sock,pass,result.transactionHash)
        
    }
    async getLog(sock,pass,res){
        var txReceipt = await web3.eth.getTransactionReceipt(res)
        var sender = txReceipt.logs[0].data.slice(26,66);
        var log = txReceipt.logs[0].data.slice(194,258);
        var x = web3.utils.hexToAscii("0x" + log)
        console.log("[notice] Set Name! addr:0x" + sender + " ,log:" + x );
        var j ={
            log:x,
            num:pass
        }
        sock.emit('notice_openLocker',JSON.stringify(j));
    }

}

var v = new locker();
v.startlockerSystem();