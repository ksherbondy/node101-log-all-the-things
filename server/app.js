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
    const logLine = `${agent},${time},${method},${resource},${version},${status}\n`;
    const logFilePath = path.join(__dirname, '..', 'log.csv');
    console.log(logLine);
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
    const logFilePath = path.join(__dirname, '..', 'log.csv');

    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error');

        // Split and filter out any completely empty lines
        const lines = data.split('\n').filter(line => line.trim() !== "");

        // Map headers and trim them to be safe
        const headers = lines[0].split(',').map(h => h.trim());

        const result = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
                // Trim values to ensure no hidden spaces break the tests
                obj[header] = values[index] ? values[index].trim() : "";
                
                return obj;
            }, {});
        });
        console.log(result);
        res.json(result);
    });
});

app.use((req, res) => {
    res.status(404).send('Not Found');
})

module.exports = app;
