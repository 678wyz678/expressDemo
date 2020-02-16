const express = require('express')
const app = express()
app.listen(7777);
app.all('/', (req, res) => res.send('hello') );

console.log('app端口7777监听中')
app.get("/api/timestamp/", (req, res) => {
    res.json({ unix: Date.now(), utc: Date() });
});

app.get("/api/timestamp/:date_string", (req, res) => {
    let dateString = req.params.date_string;

    //A 4 digit number is a valid ISO-8601 for the beginning of that year
    //5 digits or more must be a unix time, until we reach a year 10,000 problem
    if (/\d{5,}/.test(dateString)) {
        var dateInt = parseInt(dateString);
        //Date regards numbers as unix timestamps, strings are processed differently
        res.json({ unix: dateString, utc: new Date(dateInt).toUTCString() });
    }

    let dateObject = new Date(dateString);

    if (dateObject.toString() === "Invalid Date") {
        res.json({ error: "Invaid Date" });
    } else {
        res.json({ unix: dateObject.valueOf(), utc: dateObject.toUTCString() });
    }
});