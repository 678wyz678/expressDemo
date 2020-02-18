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
    url: { type: String, required: true },
    uid: { type: Number, required: true }
}, { versionKey: false });

const Url = mongoose.model('Url', urlSchema)

var db = mongoose.connection

app.get("/api/shorturl/new-:ht?(\/\/)?:data?", (req, res) => {
    const fullUrl = req.params.ht + req.params[0] + req.params.data
    console.log(fullUrl)
    if (urlFormatVaild(req.params.data)) {
        urlIsFound(req.params.data, function (err, hostname, addr) {
            if (err) { console.log(err) }
            if (addr) {
                mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })
                db.once('open', function () {
                    // we're connected!
                    console.log("we're connected!")
                    maxOfUid(Url, function (err, maxVal) {
                        if (err) { console.log(err) }
                        const id = sha256(hostname)
                        var url = new Url({ url_id: id, url: fullUrl, uid: maxVal })
                        findAndCreateUrl(Url, url, function (err, doc) {
                            if (err) { console.log(err) }
                            res.json({ origin_url: doc['url'], short_url: doc['uid'] })
                            db.close()
                        })
                    })
                })
            } else {
                res.json({ "error": "invalid URL" })
            }
        })
    } else {
        res.json({ "error": "invalid URL" })
    }

    db.close()
});



app.get("/api/shorturl/:data(\\d{0,3})", function (req, res) {
    console.log(req.params.data)
    mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })
    db.once("open",function(){
        Url.findOne({uid:req.params.data},function(err, doc){
            if (err){throw err}
            if(doc){
                res.redirect(doc['url'])
            }else{
                res.json({ "error": "invalid URL" })
            }
        })
    })
    
})

app.use("*", function (req, res) {
    res.json({ "error": "invalid URL" })
})

const maxOfUid = function (Model, done) {

    Model.findOne(function (err, res) {
        if (err) { console.log(err) }
        if (res) {
            Model.find({}).sort({ 'uid': -1 }).limit(1).exec(function (err, docs) {
                if (err) { console.log(err) }
                done(null, docs[0].uid + 1)
            })
        } else {
            done(null, 0)
        }
    })

}

const findAndCreateUrl = function (Model, url, done) {
    Model.findOne({ url_id: url['url_id'] }, function (err, doc) {
        if (err) {
            console.log(err)
            done(err)
        }
        if (doc) {
            console.log('数据存在')
            console.log(doc)
            done(null, doc)
        }
        else {
            Model.create(url, function (err, doc) {
                if (err) {
                    console.log(err)
                }
                console.log(doc)
                done(null, doc)
            })
        }
    })
}

const urlFormatVaild = function (url) {
    const reg = /^www\.[0-9a-z]+(\.com|\.cn)(\.cn)?$/
    if (reg.test(url)) {
        return true
    } else {
        return false
    }

}

const urlIsFound = function (url, done) {
    dns.lookup(url, function (err, addr) {
        if (err) { console.log("dns.lookup" + err); done(err) }
        if (addr) {
            done(null, url, addr)
        }
    })
}

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