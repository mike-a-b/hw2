const express = require('express');
const app = express();
const env = require('dotenv').config();//Интервал и временной промежуток default 1000 msec;10 sec;
const PORT = 3000;

let connections = [];

app.get("/date", (req, res, next) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked"); // https://en.wikipedia.org/wiki/Chunked_transfer_encoding
    connections.push(res);
});

let tick = 0;
setTimeout(function run() {
    let time = new Date(Date.now());
    console.log(time.toUTCString());
    if (++tick > env.parsed.ENDTIME) {
        connections.map(res => {
            res.write("END TIME\n");
            res.write(time.toUTCString());
            res.end();
        })
        connections = [];
        tick = 0;
    }
    connections.map((res, i) => {
        res.write(`Time now:  ${time.toUTCString()} Tick: ${tick}.\n`)
    })
    setTimeout(run, env.parsed.INTERVAL)
}, env.parsed.INTERVAL)

app.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
})
