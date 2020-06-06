var express=require('express');
var app=express();
app.set('view engine','ejs');
require('dotenv').config();
var debug = require('debug')('http');
var morgan = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false})); // support encoded bodies
// app.use('/assets', express.static('./public'));
var mysql = require('mysql');
var con = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "2609841",
 database: "medicine"
});
app.use(express.static(__dirname + '/public'));
 con.connect(function(err) {
  if (err) throw  err;
  console.log("connected");});
var mysqlAdmin = require('node-mysql-admin');
app.use(mysqlAdmin(app));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});
app.get('/donate', (req, res,next) => {
  res.sendFile(path.join(__dirname,'donate.html'));
});
app.get('/bank', (req, res) => {
  var err=false;
  res.render('bank',{err:err});
});
app.get('/moneydonation', (req, res) => {
  res.sendFile(path.join(__dirname,'money.html'));
});
app.get('/admin', function(req,res) {
  var err=false;
  var corr=false;
  res.render('admin',{err:err});
  // body...
});
app.get('/ngo', (req, res) => {
  res.sendFile(path.join(__dirname,'ngo.html'));
});
app.get('/req', (req, res) => {
   con.query('SELECT * FROM ngo ', function(err, result, fields) {
      if (err) throw err;
      if (result.length > 0) {
        console.log(result)
        var err=true;
        var corr=false;
        res.render('req',{err:err,data:result,corr:corr});
      } else {
        var err=false;
        var corr=true;
        res.render('req',{err:err,corr:corr});
      }     
    });


});
app.post('/donate', function(req, res) {
  console.log(req.body.medi)
  console.log(req.body.fname)
  var sql = "INSERT INTO donor (fname,lname,address,city,state,medicine,contact) VALUES ('"+req.body.fname+"','"+req.body.lname+"','"+req.body.add+"','"+req.body.city+"','"+req.body.state+"','"+req.body.medi+"','"+req.body.phoneno+"')";
  con.query(sql, function(err, result)  {
    console.log("i am query")
   if(err) throw err;
   console.log("table created");
   });
  res.sendFile(path.join(__dirname,'index.html'));
});
app.post('/admin', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log(username);
  console.log(password);
    con.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(err, result, fields) {
      if (err) throw err;
      
      if (result.length > 0) {
        console.log(result)
        res.sendFile(path.join(__dirname,'main.html'));
      } else {
        var err=true;
        res.render('admin',{err:err})
      }     
    });

});
app.post('/bank', function(req, res) {
  var medi = req.body.medi;
  var city = req.body.city;
  console.log(medi);
  console.log(city);
    con.query('SELECT * FROM donor WHERE medicine = ? AND city = ?', [medi,city], function(err, result, fields) {
      if (err) throw err;
      if (result.length > 0) {
        console.log(result)
        var err=true;
        var corr=false;
        res.render('bank',{err:err,data:result,corr:corr,medi:req.body.medi});
      } else {
        var err=false;
        var corr=true;
        res.render('bank',{err:err,corr:corr});
      }     
    });

});
app.post('/ngo', function(req, res) {
  console.log(req.body.name)
  console.log(req.body.add)
  var sql = "INSERT INTO ngo (name,address,city,state,phoneno) VALUES ('"+req.body.name+"','"+req.body.add+"','"+req.body.city+"','"+req.body.state+"','"+req.body.phoneno+"')";
  con.query(sql, function(err, result)  {
    console.log("i am query")
   if(err) throw err;
   console.log("table created");
   });
  res.sendFile(path.join(__dirname,'index.html'));
});
app.post('/delete/:_id', function(req, res, next){
var ser=req.params._id;
console.log(req.params._id);
  con.query('DELETE FROM ngo WHERE did = ?',[ser], function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
    res.redirect('/req')
  });

});

app.listen(3000);
console.log('you are listening to port 3000')

