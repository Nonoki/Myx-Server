var express = require('express'),
    config = require('./nodejs/configParser').config; 

var app = express();

//Cookie
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieSession({secret: 'app_1'}));


//Mongo
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  name: String,
  category: String,
  tags: [{ name: String, date: Date }]
});

var userSchema = new Schema({
  id: String,
  key: String,
  name: String,
  color: String,
  collections: [{type: Schema.Types.ObjectId, ref: 'Collection'}]
});

var recordSchema = new Schema({
  price: { type: Number, min: 0},
  category: {type: Schema.Types.ObjectId, ref: 'Category'},
  date: Date
});

var collectionSchema = new Schema({
  name: String,
  records: [{type: Schema.Types.ObjectId, ref: 'User'}]
});


var Category = mongoose.model('Category', categorySchema);
var User = mongoose.model('User', userSchema);
var Record = mongoose.model('Record', recordSchema);
var Collection = mongoose.model('Collection', collectionSchema);

mongoose.connect('mongodb://'+config.global_public.dbHost+'/'+config.global_public.dbName);


//server
var server = app.listen(config.global_public.port, function () {
  var host = server.address().address
  var host = config.global_public.host
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


//action
app.post('/test', function (req, res) {
  console.log(req.body);
  res.json("Salut"+req.body);
});

app.post('/createUser', function (req, res) {
  var request = req.body;
  var userKey = request.key;
  var userName = request.name;
  console.log('Key: '+userKey);
  console.log('Name: '+userName);
  var newUser = new User(request);
  newUser.save(function (err) {
    if (err) res.json('{"code": "0", "msg": "'+err+'"}');
    res.json('{"code": "0", "id": "'+newUser._id+'"}');
  });
});



// //mongod --dbpath=/data --port 27017
// //curl -d '{"MyKey":"My Value"}' -H "Content-Type: application/json" http://127.0.0.1:3000/
// curl -d '{"key":"key213452", "name": "Yohan"}' -H "Content-Type: application/json" http://127.0.0.1:3000/createUser