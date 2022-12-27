const fs = require("fs");

fs.writeFileSync("./messge.txt", "Okay now nodejs");

// const start = Date.now();
// for (let i = 0; i < 1000000; i++) {
//     console.log(i);
// }
// const finish = (start - Date.now()) / 1000;
// console.log(finish);

const url = "any ur;";

const sendMessage = () => {
    console.log("Hello");
    console.log(__dirname, __filename);
};

module.exports.sendMessage = sendMessage;
