let express = require('express'); //import express, because I want easier management of GET and POST requests.  
//let fs = require('fs');  //fs is used to manipulate the file system
let MySql = require('sync-mysql');  //MySql is used to manipulate a database connection
"use strict";

//set up the database connection 
const options = {
  user: 'b33',
  password: '7PQ7SO',
  database: 'b33mars',
  host: 'dataanalytics.temple.edu'
};

// create the database connection
const connection = new MySql(options);

let app = express();  //the express method returns an instance of a app object
app.use(express.urlencoded({extended:false}));  //use this because incoming data is urlencoded

app.use(function(req, res, next) {
    express.urlencoded({extended:false})
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();  //go process the next matching condition
  });

//supporting functions *******************************************************************
let createbill = function(res,description,status,amount,method,category,date,userid){
    let txtSQL = "insert into bill (description,status,amount,method,category,date,userid) values (?,?,?,?,?,?,?)";
    try{
        var result = connection.query(txtSQL,[description,status,amount,method,category,date,userid]);
    }
    catch(e){
        console.log(e);
        responseWrite(res,"Unexpected database error. (creatbill)",500);
        return;
    }
    responseWrite(res,result.insertId,200);
    return;
};

let deletebill = function(res,billid){
    let txtSQL = "delete from bill where billid=?"
    try{
        var result = connection.query(txtSQL,[billid]);
    }
    catch(e){
        console.log(e);
        responseWrite(res,"Unexpected database error. (deltebill)",500);
        return;
    }
    responseWrite(res,"Delete the activity successfully",200);
    return;
};

let getlistbills = function(res,userid){
    let txtSQL = "select * from bill where userid=? order by date desc";
    try{
        var result = connection.query(txtSQL,[userid]);
    }
    catch(e){
        console.log(e);
        responseWrite(res,"Unexpected database error. (getlistbills)",500);
        return;
    }
    if(result.length == 0){
        responseWrite(res,"No bills exist. (getlistbills)",400);
        return;
    }
    responseWrite(res,result,200);
    return;
};

let getonebill = function(res,billid){
    let txtSQL = "select * from bill where billid=?";
    try{
        var result = connection.query(txtSQL,[billid]);
    }
    catch(e){
        console.log(e);
        responseWrite(res,"Unexpected database error. (getonebill)",500);
        return;
    }
    if(result.length == 0){
        responseWrite(res,"No billid exist. (getonebill)",400);
        return;
    }
    responseWrite(res,result,200);
    return;
};

let getsum = function(res,status,userid){
    let txtSQL = "select sum(amount) from bill where status=? and userid=?";
    try{
        var result = connection.query(txtSQL,[status,userid]);
    }
    catch(e){
        console.log(e);
        responseWrite(res,"Unexpected database error. (getsum)",500);
        return;
    }
    responseWrite(res,result,200);
    return;
};

let getchart = function(res,status,userid){
    let txtSQL = "select sum(amount),category from bill where status=? and userid=? group by category;";
    try{
        var result = connection.query(txtSQL,[status,userid]);
    }
    catch(e){
        console.log(e);
        responseWrite(res,"Unexpected database error. (getchart)",500);
        return;
    }
    responseWrite(res,result,200);
    return;
};

//responseWrite is a supporting function.  It sends 
// output to the API consumer and ends the response.
// This is hard-coded to always send a json response.
let responseWrite = function(res,Output,responseStatus){
    res.writeHead(responseStatus, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(Output));
    res.end();
};

//error trapping ************************************************************************
app.post("/bill",function(req,res,next){
    let description = req.body.description;
    let status = req.body.status;
    let amount = req.body.amount;
    let method = req.body.method;
    let category = req.body.category;
    let date = req.body.date;
    let userid = req.body.userid;
    if(description == undefined || description == ""){
        responseWrite(res,"Error in POST bill. The description is missing or incorrect.",400);
        return;
    }
    if(status == undefined || status == ""){
        responseWrite(res,"Error in POST bill. The status is missing or incorrect.",400);
        return;
    }
    if(amount == undefined || amount == "" || isNaN(amount)){
        responseWrite(res,"Error in POST bill. The amount is missing or incorrect. It must be a number.",400);
        return;
    }
    if(method == undefined || method == ""){
        responseWrite(res,"Error in POST bill. The method is missing or incorrect.",400);
        return;
    }
    if(category == undefined || category == ""){
        responseWrite(res,"Error in POST bill. The category is missing or incorrect.",400);
        return;
    }
    if(date == undefined || date == ""){
        responseWrite(res,"Error in POST bill. The date is missing or incorrect.",400);
        return;
    }
    if(userid == undefined || userid == "" || isNaN(userid)){
        responseWrite(res,"Error in POST bill. The userid is missing or incorrect. It must be a number.",400);
        return;
    }
    next();
});

app.delete("/bill",function(req,res,next){
    let billid = req.body.billid;
    if(billid == undefined || billid == "" || isNaN(billid)){
        responseWrite(res,"Error in DELETE bill. The billid is missing or incorrect. It must be a number.",400);
        return;
    }
    next();
});

app.get("/bills",function(req,res,next){
    let userid = req.query.userid
    if(userid == undefined || userid == "" || isNaN(userid)){
        responseWrite(res,"Error in GET bills. The userid is missing or incorrect. It must be a number.",400);
        return;
    }
    next();
});

app.get("/bill",function(req,res,next){
    let billid = req.query.billid;
    if(billid == undefined || billid == "" || isNaN(billid)){
        responseWrite(res,"Error in GET bill. The billid is missing or incorrect. It must be a number.",400);
        return;
    }
    next();
});

app.get("/sum",function(req,res,next){
    let status = req.query.status;
    let userid = req.query.userid;
    if(status == undefined || status == ""){
        responseWrite(res,"Error in GET sum. The status is missing or incorrect.",400);
        return;
    }
    if(userid == undefined || userid == "" || isNaN(userid)){
        responseWrite(res,"Error in GET sum. The userid is missing or incorrect. It must be a number.",400);
        return;
    }
    next();
});

app.get("/chart",function(req,res,next){
    let status = req.query.status;
    let userid = req.query.userid;
    if(status == undefined || status == ""){
        responseWrite(res,"Error in GET chart. The status is missing or incorrect.",400);
        return;
    }
    if(userid == undefined || userid == "" || isNaN(userid)){
        responseWrite(res,"Error in GET chart. The userid is missing or incorrect. It must be a number.",400);
        return;
    }
    next();
});

//event handlers ************************************************************************
app.post("/bill",function(req,res){
    let description = req.body.description;
    let status = req.body.status;
    let amount = req.body.amount;
    let method = req.body.method;
    let category = req.body.category;
    let date = req.body.date;
    let userid = req.body.userid;
    createbill(res,description,status,amount,method,category,date,userid);
});

app.delete("/bill",function(req,res){
    let billid = req.body.billid;
    deletebill(res,billid);
});

app.get("/bills",function(req,res){
    let userid = req.query.userid;
    getlistbills(res,userid);
});

app.get("/bill",function(req,res){
    let billid = req.query.billid;
    getonebill(res,billid);
});

app.get("/sum",function(req,res){
    let status = req.query.status;
    let userid = req.query.userid;
    getsum(res,status,userid);
});


app.get("/chart",function(req,res){
    let status = req.query.status;
    let userid = req.query.userid;
    getchart(res,status,userid);
});


//what the app should do when it received a "GET" against the root
app.get('/', function(req, res) {
    //what to do if request has no route ... show instructions
    let message = [];
    
    message[message.length] = "To create a bill, POST to ./bill and provide description,status,amount,method,category,date,and userid.  " +
    "The result will be the bill created.";
    message[message.length] = "Issue a DELETE against ./bill with a billid.  " + 
    "The bill will be deleted from the database and the result will be a confirmation message.";
    message[message.length] = "To get a list of bill for a specific user, issue a GET against ./bills and provide the userid order by current time. "+
    "The result will be a JSON object with 0 or more bill records in it.";
    message[message.length] = "To get one specific bill, issue a GET against ./bill and provide the billid. "+
    "The result will be a JSON object representing the bill.";
    message[message.length] = "Issue a GET against ./sum with a userid and status token to  get an JSON response.  " +
    "The JSON objects sum of the income/expense price of the user's bill.";
    message[message.length] = "Issue a GET against ./chart with a userid and status token to  get an JSON response.  " +
    "The JSON objects summarizes the income/expense of the user's bill.";

	responseWrite(res,message,200);
    return
});
  
//This piece of code creates the server  
//and listens for requests on a specific port
//we are also generating a message once the 
//server is created
let server = app.listen(8221, "0.0.0.0" ,function(){
    let host = server.address().address;
    let port = server.address().port;
    console.log("The endpoint server is listening on port:" + port);
});