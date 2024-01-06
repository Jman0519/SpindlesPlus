const http = require('http');
const fs = require('fs');

let jobs = {};
try {
    jobs = JSON.parse(fs.readFileSync("./backend/jobs.json"));
}
catch (err) {
    console.log(err);
}

server = http.createServer();
server.listen(80);

server.on('request', async (req, res) => {
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
    console.log(url);
    console.log("url", url);
    if (url == "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/index.html'));
    }
    else if (url == "/CreateNewJob.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/CreateNewJob.html'));
    }
    else if (url == "/favicon.ico") {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end(fs.readFileSync('images/favicon.ico'));
    }
    else if (url == "/addJob") {
        let time = Date.now();
        body.uuid = time;
        jobs[time] = body;
        fs.writeFileSync("./backend/jobs.json", JSON.stringify(jobs));
    }
    else if (url == "/getJobs") {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jobs));
    }
    else if (url == "/deleteJob") {
        delete jobs[body.uuid];
        fs.writeFileSync("./backend/jobs.json", JSON.stringify(jobs));
    }
    else if (url == "/editJob") {
        console.log("need to implement editing a job");
    }
    else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/index.html'));
    }
});