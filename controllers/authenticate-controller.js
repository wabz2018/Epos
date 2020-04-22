let Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');

let connection = require('./../config');
module.exports.authenticate=function(req,res){
    let email=req.body.email;
    let password=req.body.password;
    connection.query('SELECT * FROM logins WHERE email = ?',[email], function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query'
            })
        }else{
            if(results.length >0){
                let userrole=results[0].userrole;
                let   decryptedString = cryptr.decrypt(results[0].password);
                if(password==decryptedString){
                    if(userrole=='Admin') {
                        res.render('dashboard', {
                            title: 'SHOPAPP Buy |Sell |Finance',
                            hd:'Admin Panel'
                        });
                    }
                    else if(userrole=='User'){
                        res.render('dashboard', {
                            title: 'SHOPAPP Buy |Sell |Finance',
                            hd:'User Panel'
                        });
                    }
                    else{
                        res.send('Wrong module for user');
                    }
                }else{
                    res.json({
                        status:false,
                        message:"Email and password does not match"
                    });
                }

            }
            else{
                res.json({
                    status:false,
                    message:"Email does not exits"
                });
            }
        }
    });
}