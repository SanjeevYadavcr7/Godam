const order = require('../../models/order');

function accountController(){
    return{
        index(req,res){
            res.render('myAccount');
        },
        indexProfile(req,res){
            console.log(req);
            order.find( {status:{$ne :'completed'}}, null, {sort: {'createdAt':-1}}).
            populate('customerId', '-password').exec((err, orders) => {
                if(req.xhr){
                    return res.json(orders)
                }
                else{
                     // to get info of cutomer
                    return res.render('myAccount/orders')
                }
            })  
        }
    }
}

module.exports = accountController
