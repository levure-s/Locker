// vargen.js - Variable Generator
const fs = require('fs');
var inputFilenameWithoutExtension = "Locker_sol_Locker";
var outputJavaScriptFilename = "Locker_abi_bin.js";

var a = fs.readFileSync(inputFilenameWithoutExtension + ".abi", {encoding: "utf-8"});
var b = fs.readFileSync(inputFilenameWithoutExtension + ".bin", {encoding: "utf-8"});

var msg = "module.exports = {\r\n";
msg += " abi: " + a + ",\r\n" + " bin: '0x" + b + "'\r\n";
msg += "};";

fs.writeFileSync(outputJavaScriptFilename, msg);
console.log("generated file : " + outputJavaScriptFilename);
