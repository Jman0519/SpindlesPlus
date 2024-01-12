const http = require('http');
const fs = require('fs');
const EventEmitter = require('node:events');

let jobs = {};
try {
    jobs = JSON.parse(fs.readFileSync("./backend/jobs.json"));
}
catch (err) {
    console.log(err);
}

server = http.createServer();
server.listen(80);

let newJobsEvent = new EventEmitter();
newJobsEvent.setMaxListeners(100);

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
        try {
            body = JSON.parse(buffer.toString());
            console.log('\nbody: ')
            console.log(JSON.stringify(body));
        } catch (err) {
            console.log(err);
        }
    }

    let url = req.url;
    console.log(url);
    console.log("url", url);

    let cookie = {};
    try {
        cookie = JSON.parse(req.headers.cookie);
    }
    catch (err) {
    }

    console.log("cookie", cookie);

    // things that need no login
    if (url == "/style.css") {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(fs.readFileSync('frontend/style.css'));
        return;
    }
    else if (url == "/favicon.ico") {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end(fs.readFileSync('images/favicon.ico'));
        return;
    }
    else if (url == "/spindles_plus_image.gif") {
        res.writeHead(200, { 'Content-Type': 'image/gif' });
        res.end(fs.readFileSync('images/spindles_plus_image.gif'));
        return;
    }

    // check for password
    if (cookie.password != "spi45103pi") {
        res.writeHead(401, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync("frontend/Login.html"));
        console.log("sending them to the login page");
        return;
    }

    // things that need login
    if (url == "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/JobBoard.html'));
    }
    else if (url == "/CreateNewJob.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/CreateNewJob.html'));
    }
    else if (url == "/EditJob.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/EditJob.html'));
    }
    else if (url == "/CancelJob.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/CancelJob.html'));
    }
    else if (url == "/CompleteJob.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/CompleteJob.html'));
    }
    else if (url == "/CompletedJobs.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/CompletedJobs.html'));
    }
    else if (url == "/CanceledJobs.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/CanceledJobs.html'));
    }
    else if (url == "/ReviewCanceledJob.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/ReviewCanceledJob.html'));
    }
    else if (url == "/ReviewCompletedJob.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/ReviewCompletedJob.html'));
    }
    else if (url == "/About.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/About.html'));
    }

    else if (url == "/addJob") {
        let time = Date.now();
        body.uuid = time;
        jobs[time] = body;
        fs.writeFileSync("./backend/jobs.json", JSON.stringify(jobs));
        newJobsEvent.emit('newJob');
    }
    else if (url == "/getJobs") {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jobs));
    }
    else if (url == "/getCanceledJobs") {
        let canceledJobs = JSON.parse(fs.readFileSync("./backend/canceledJobs.json"));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(canceledJobs));
    }
    else if (url == "/getCompletedJobs") {
        let completedJobs = JSON.parse(fs.readFileSync("./backend/completedJobs.json"));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(completedJobs));
    }
    else if (url == "/editJob") {
        jobs[body.uuid] = body;
        fs.writeFileSync("./backend/jobs.json", JSON.stringify(jobs));
        newJobsEvent.emit('newJob');
    }
    else if (url == "/completeJob") {
        delete jobs[body.uuid];
        fs.writeFileSync("./backend/jobs.json", JSON.stringify(jobs));
        newJobsEvent.emit('newJob');
        let completedJobs = JSON.parse(fs.readFileSync("./backend/completedJobs.json"));
        completedJobs[body.uuid] = body;
        fs.writeFileSync("./backend/completedJobs.json", JSON.stringify(completedJobs));
    }
    else if (url == "/cancelJob") {
        delete jobs[body.uuid];
        fs.writeFileSync("./backend/jobs.json", JSON.stringify(jobs));
        newJobsEvent.emit('newJob');
        let canceledJobs = JSON.parse(fs.readFileSync("./backend/canceledJobs.json"));
        canceledJobs[body.uuid] = body;
        fs.writeFileSync("./backend/canceledJobs.json", JSON.stringify(canceledJobs));
    }
    else if (url == "/updateJobs") {
        console.log(newJobsEvent.listenerCount('newJob'));
        newJobsEvent.once('newJob', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(jobs));
        });
    }
    else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('frontend/JobBoard.html'));
    }
});