
const MongoClient = require("mongodb").MongoClient
const mongoose = require("mongoose")
const equal = require("assert").equal
const Schema = mongoose.Schema

// Connection url
const uri = "mongodb://localhost:27017";
// Database Name
const dbName = "test";


/** 2) Create a 'Person' Model */
const personSchema = new Schema({
    name: { type: String, required: true },
    age: Number,
    favoriteFoods: [String]
});
/** 3) Create and Save a Person */
var Person = mongoose.model('Person', personSchema);

var createAndSavePerson = function (done) {
    var janeFonda = new Person({ name: "Jane Fonda", age: 84, favoriteFoods: ["vodka", "air"] });

    Person.findOne({name:janeFonda.name},function (err, res) {
        if (err) { console.log(err) }
        console.log(res)
        if(res){
            console.log('数据存在')
            db.close()
        }else{
            Person.create(janeFonda, function(err, doc){
                if (err) { console.log(err) }
                done(null, doc)
            })
        }
    })
    
};

/** 4) Create many People with `Model.create()` */
var arrayOfPeople = [
    { name: "Franki", age: 72, favoriteFoods: ["Del Taco"] },
    { name: "Sold", age: 73, favoriteFoods: ["roast chicken"] },
    { name: "Roberte", age: 71, favoriteFoods: ["wine"] }
];

var createManyPeople = function (arrayOfPeople, done) {
    Person.create(arrayOfPeople, function (err, people) {
        if (err) return console.log(err);
        done(null, people);
    });
};


/** 5) Use `Model.find()` */
var findPeopleByName = function (personName, done) {
    Person.find({ name: personName }, function (err, personFound) {
        if (err) return console.log(err);
        done(null, personFound);
    });
};

/** 6) Use `Model.findOne()` */
var findOneByFood = function (food, done) {
    Person.findOne({ favoriteFoods: food }, function (err, data) {
        if (err) return console.log(err);
        done(null, data);
    });
};

/** 7) Use `Model.findById()` */
var findPerson = function (done) {
    Person.find(function (err, data) {
        if (err) return console.log(err);
        done(null, data);
    });
};

/** 7) Use `Model.remove()` */
var removePersonByName = function (peopleName, done) {
    Person.remove({ name: peopleName }, function (err, removePeo) {
        if (err) { console.log(err) }
        done(null, removePeo)
    })
}


mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("we're connected!")


    createAndSavePerson(function (err, res) {
        if (err) { console.log(err) }
        console.log(res)
        db.close()
    })




});



// Connect using MongoClient
// MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, client) {
//     if (err) {
//         console.log(err)
//         throw err
//     }
//     console.log('数据库已创建');

//     client.db(dbName).collection("orders").aggregate([ //连接集合
//         {
//             $lookup:
//             {
//                 from: 'products',            // 右集合
//                 localField: 'product_id',    // 左集合 join 字段
//                 foreignField: '_id',         // 右集合 join 字段
//                 as: 'orderdetails'           // 新生成字段（类型array）
//             }
//         }
//     ]).toArray(function (err, res) {
//         if (err) throw err;
//         console.log(JSON.stringify(res))
//         client.close();
//     })

// })


