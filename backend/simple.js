const http = require("http");

const server = http.createServer((req, res) => {
    res.end("Hello");
});

server.listen(3001, () => {
    console.log("Server running on port 3001");
});