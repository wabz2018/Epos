let Cryptr = require('cryptr');
let express=require("express");
let connection = require('./../config');
// cryptr = new Cryptr('myTotalySecretKey');

module.exports.register=function(req,res){
    let today = new Date();
    let encryptedString = cryptr.encrypt(req.body.password);
    let users={
        "name":req.body.name,
        "email":req.body.email,
        "password":encryptedString,
        "created_at":today,
        "updated_at":today
    }
    connection.query('INSERT INTO logins SET ?',users, function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query'
            })
        }else{
            res.render('index',{
                title:'EPOS |BUY|SELL',
                hd:'Login now'
            })
        }
    });
}