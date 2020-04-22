require("express");
let connection = require('./../config');
// cryptr = new Cryptr('myTotalySecretKey');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer=require('multer');
const storage= multer.diskStorage({
    destination:'./uploads/',
    filename:function (req,file, cb) {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload= multer({
    storage:storage,
    limits:{fileSize:1024*1024*5},
    fileFilter:function(rweq, file, cb){
        checkFileType(file, cb);
    }
}).single('productimage');
function checkFileType(file, cb) {
//allowed extensions
    const filetypes=/jpeg|png|gif|jpg/;
    const extname =filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype=filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }
    else{
        cb('Error: images only');
    }
}
module.exports.addproduct=function(req,res){
    upload(req, res, (err)=> {
        if(err)
        {
            res.render('index', {
                msg: err,
                title:'Image  Upload',
                hd:'Image Upload'
            });

        }
        else {
            if(req.file==undefined)
            {res.render('index',{
                    msg:'Error:No file selected of upload!',
                    title:'Image  Upload',
                    hd:'Image Upload'
                } );
            }
            else {
                console.log(req.file);
                let products = {
                    "productcode": req.body.productcode,
                    "productname": req.body.productname,
                    "price": req.body.price,
                    "availqnty": req.body.availqnty,
                    "productimage": req.file.path
                }
                connection.query('INSERT INTO products SET ?', products, function (error, results, fields) {
                    if (error) {
                        res.json({
                            status: false,
                            message: 'there are some error with query' + error,
                        })
                    } else {
                        res.render('dashboard', {
                            title: 'EPos Buy |Sell |Finance',
                            hd: 'Add a product'
                            //users : rows
                        });
                    }
                });
            } }
    });

}