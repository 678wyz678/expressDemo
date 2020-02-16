const express = require('express')
const app = express()
const sha256 = require('sha256')
const dns = require('dns')
// app.listen(7777);
// app.all('/', (req, res) => res.send('hello'));
// var cookieParser = require('cookie-parser')
// app.use(cookieParser())
// console.log('app端口7777监听中')
// app.get("/api/timestamp/", (req, res) => {
//     res.json({ unix: Date.now(), utc: Date() });
// });

dns.lookup("www.github.com", function (err, addr) {
    if (err) { console.log(err) }
    console.log(addr)
    dns.reverse(addr, function(err, hostname){
        if(err){console.log(err)}
        console.log(JSON.stringify(hostname))
    })
})

const a = sha256("www.github.com")
const b = sha256("www.github.com")

console.log(a)
console.log(b)
console.log(a===b)

// app.get("/api/timestamp/:date_string", (req, res) => {
//     let dateString = req.params.date_string;

//     //A 4 digit number is a valid ISO-8601 for the beginning of that year
//     //5 digits or more must be a unix time, until we reach a year 10,000 problem
//     if (/\d{5,}/.test(dateString)) {
//         var dateInt = parseInt(dateString);
//         //Date regards numbers as unix timestamps, strings are processed differently
//         res.json({ unix: dateString, utc: new Date(dateInt).toUTCString() });
//     }

//     let dateObject = new Date(dateString);

//     if (dateObject.toString() === "Invalid Date") {
//         res.json({ error: "Invaid Date" });
//     } else {
//         res.json({ unix: dateObject.valueOf(), utc: dateObject.toUTCString() });
//     }
// });

// app.use("/api/whoami", (req, res) => {
//     console.log(req.headers)
//     res.json({ipaddress:req.headers.host,language:req.headers["accept-language"],software:req.headers["user-agent"]})
// })