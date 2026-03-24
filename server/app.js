const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');


app.use((req, res, next) => {
    // write your logging code here
    //console.log(req);
    const agent = req.headers['user-agent'].replaceAll(/,/g,'');
    const time = new Date().toISOString();
    const method = req.method;
    const resource = req.url;
    const version = 'HTTP/' + req.httpVersion;
    const status = 200;
    const logLine = `\n${agent},${time},${method},${resource},${version},${status}`;
    const logFilePath = path.join(__dirname, '..', 'log.csv');
    console.log(agent);
    fs.appendFile(logFilePath, logLine, (err) => {
        if (err) throw err;
    });
    next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.status(200).send('ok');
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here

});

module.exports = app;
