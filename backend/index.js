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
    else if (url == '/game.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/game.html'));
    }
    else if (url == '/game.js') {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.end(fs.readFileSync('frontend/game.js'));
    }
    else if (url == "/contactUs.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/contactUs.html'));
    }
    else if (url == "/about.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/about.html'));
    }
    else if (url == "/privacyPolicy.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/privacyPolicy.html'));
    }
    else if (url == '/ads.txt') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(fs.readFileSync('frontend/ads.txt'));
    }
    else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/index.html'));
    }
});