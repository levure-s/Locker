// mnemonic gen
const fs = require('fs');
const crypto = require("crypto");
var bip39 = require("bip39");
var mnemonic_filename = "mnemonic.txt";

// bip39.wordlists.EN
// bip39.wordlists.JA
// bip39.wordlists.french
// bip39.wordlists.italian
// bip39.wordlists.korean
// bip39.wordlists.spanish
// bip39.wordlists.chinese_simplified
// bip39.wordlists.chinese_traditional

var wordlists = bip39.wordlists.EN;

var entropy = crypto.randomBytes(32);
let mnemonic = bip39.entropyToMnemonic(entropy, wordlists);

console.log("-----");
console.log(mnemonic);
console.log("-----");

fs.writeFileSync(mnemonic_filename, mnemonic);

