const express = require('express')
const app = express()
const sha256 = require('sha256')
const dns = require('dns')
const mongoose = require("mongoose")
const Schema = mongoose.Schema


app.listen(7777);
console.log('app端口7777监听中')
app.all('/', (req, res) => res.send('hello'));

const urlSchema = new Schema({
    url_id: { type: String, required: true },
    url: { type: String, required: true }
}, { versionKey: false });

const Url = mongoose.model('Url', urlSchema)

var db = mongoose.connection

app.get("/api/shorturl/new-(http:\/\/|https:\/\/)?:data?", (req, res) => {
    // console.log(req.params.data)
    // console.log(/^www\.[0-9a-z]+(\.com|\.cn)(\.cn)?$/.test(req.params.data))
    
    if (/^www\.[0-9a-z]+(\.com|\.cn)(\.cn)?$/.test(req.params.data)) {
        dns.lookup(req.params.data, function (err, addr) {
            if (err) { res.json({ "error": "invalid URL" }); console.log(err); return }
            mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })
            let hostname = this.hostname
            // console.log(this.hostname)
            mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })
            // console.log(db.readyState)
            db.on('connected', function () {
                // we're connected!
                console.log("we're connected!")
                if (addr) {
                    console.log(addr)
                    const id = sha256(hostname)
                    var url = new Url({ url_id: id, url: hostname })

                    Url.findOne({ url_id: url['url_id'] }, function (err, doc) {
                        if (err) {
                            console.log(err)
                        }
                        if (doc) {
                            console.log('数据存在')
                            console.log(doc)
                            res.json({ original_url: doc['url'] })
                            return
                        }
                        else {
                            Url.create(url, function (err, doc) {
                                if (err) {
                                    console.log(err)
                                }
                                console.log(doc)
                                res.json({ original_url: doc['url'] })
                                return
                            })
                        }
                    })
                }
            })
        })
    }
    else {
        res.json({ "error": "http invalid URL" })
    }
    db.close()
});

app.use("*", function (req, res) {
    res.json({ "error": "invalid URL" })
})

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