const http = require('http');
const fs = require('fs');

server = http.createServer();
server.listen(80);

server.on('request', (req, res) => {
    console.log('\nIncoming Request!!!');
    const buffers = [];
    for await (const chunk of req) {
        buffers.push(chunk);
    }
    let buffer = Buffer.concat(buffers).toString();

    let body = {};
    if (buffer.length == 0) {
        console.log('no body');
    }
    else {
        body = JSON.parse(buffer.toString());
        console.log('\nbody: ')
        console.log(JSON.stringify(body));
    }

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
    else if (url == "/addJob") {
        console.log("need to implement adding a job");
    }
    else if (url == "/getJobs") {
        console.log("need to implement getting all jobs");
    }
    else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/index.html'));
    }
});