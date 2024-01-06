const http = require('http');
const fs = require('fs');

server = http.createServer();
server.listen(80);

server.on('request', (req, res) => {
    let url = req.url;
    console.log("url", url);
    if (url == "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/index.html'));
    }
    else if (url == "/favicon.ico") {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end(fs.readFileSync('images/favicon.ico'));
    }
    else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/index.html'));
    }
});