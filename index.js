const express= require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer=require('multer');
const connection=require('./config');
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
}).single('myimage');
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
const port =4000;

const app=express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('public',path.join(__dirname, 'public'));
app.use('/uploads',express.static('uploads'));
app.use('/images', express.static('images'));

let addproductController=require('./controllers/addproduct-controller')
let authenticateController= require('./controllers/authenticate-controller');
let registerController =require('./controllers/register-controller');

app.post('/api/addproduct',addproductController.addproduct);
app.post('/controllers/addproduct-controller', addproductController.addproduct);
app.post('/api/register',registerController.register);
app.post('/api/authenticate', authenticateController.authenticate)

app.post('/controllers/authenticate-controller',authenticateController.authenticate);
app.post('/controllers/register-controller', registerController.register)

app.get('/', function (req, res) {
    res.render('index',{
        title:'EPOS loging',
        hd:'Login'
    })
    ;
});
//login
app.get('/login', function (req, res) {
    res.sendFile( __dirname +'/'+ "login.html" );
});

//register
app.get('/register', function(req, res) {
     res.render('register',{
        title:'EPOS | Solution',
         hd: 'Registration Panel '
     });
    }
);
app.post('/upload', (req,res)=>{
    upload(req, res,(err)=> {
        if (err) {
            res.render('index', {
                msg: err,
                title:'Image  Upload',
                hd:'Image Upload'
            });
        } else {
            if(req.file==undefined){
    res.render('index',{
        msg:'Error:No file selected of upload!',
        title:'Image  Upload',
        hd:'Image Upload'
    } );
            }
            else{
                console.log(req.file);
                res.render('index',{
                   msg:'File successfull uploaded',
                    title:'uploaded Image',
                    hd:'Image Details' ,
                    file: `uploads/${req.file.filename}`

                });
            }
        }
    });
});

app.post('/addproduct', (req,res)=>{
    upload(req, res,(err)=>{
        if(err){
            res.send('Error expressed');
        }
        else{
            res.render('products', {
                title:'EPOS|Sell|Buy',
                hd: 'ADMIN DASHBOARD'
            });
        }
    });
});
app.get('/dashboard', function (req, res) {
    res.render('dashboard', {
        title: 'Epos |manage |Sell',
        hd: 'ADMIN DASHBOARD'
    });
});

app.get('/user',function (req,res) {
res.render('users',{
   title:'EPos |manage|sell',
   hd:'User Manage'
});
});

app.get('/products', function (req, res) {
    let sql = "SELECT * FROM products";
    connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('list-products', {
            title : 'EPOS |User Manage',
            products : rows,
            hd:'Products Reports'
        });
    });
});

app.get('/productlist', function (req,res) {
let sql="select * from products";
connection.query(sql, (err,rows)=>{
    if(err) throw err;
    res.render('product-list',{
       title:'EPOS|SHOP|BUY',
       products:rows,
        hd:'Buy now'
    });
});
});

app.get('/price',function (req, res) {
   res.render('prices',{
       title:'EPOS |Price Manage',
       hd:'Manage prices'
    });
});
app.get('/country', function(req, res){
   res.render('countries',{
       title:'EPOS | Country Manage',
       hd:'Manage Countries'
   }) ;
});

app.get('/price',function (req, res) {
    res.render('prices',{
        title:'EPOS |Price Manage',
        hd:'Manage prices'
    });
});

app.get('/employee',function (req, res) {
    res.render('employees',{
        title:'EPOS |Price Manage',
        hd:'Manage Employees'
    });
});
app.get('/shop',function (req, res) {
    res.render('shops',{
        title:'EPOS |Price Manage',
        hd:'Manage Shops'
    });
});
app.get('/customer',function (req, res) {
    res.render('customers',{
        title:'EPOS |Price Manage',
        hd:'Manage Customers'
    });
});

app.get('/product',function (req, res) {
    res.render('products',{
        title:'EPOS |Price Manage',
        hd:'Manage Products'
    });
});
app.get('/supplier',function (req, res) {
    res.render('suppliers',{
        title:'EPOS |Price Manage',
        hd:'Manage Suppliers'
    });
});

app.get('/category',function (req, res) {
    res.render('categories',{
        title:'EPOS |Price Manage',
        hd:'Manage Categories'
    });
});
// view reports
app.get('/users',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM users";
    connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('list-users', {
            title : 'EPOS |User Manage',
            users : rows,
            hd:'User Reports'
        });
    });
});
app.get('/shop', async (req, res) => {
    try {
        // Rendering EJS Shop Index File
        res.render('products-list');
    } catch (err) {
        throw new Error(err);
    }
});
app.get('/listproducts',(req,res)=>{
    let sql = "SELECT * FROM products";
    connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('shop-products', {
            title : 'EPOS |Product Manage',
            products : rows,
            hd:'  Products Reports'
        });
    });
});
//end of the reports
app.listen(port,()=>{
    console.log('server running on port:'+port);
});