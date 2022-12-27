const http = require("http");
const requestHandler = require("./routes");

const server = http.createServer(requestHandler);
// console.log(os.freemem() / 1024, os.totalmem() / 1024);

server.listen(3000);
