// const Order = require('../../../models/order');
const order = require('../../../models/order');

function orderController(){
    return{
        index(req,res){
            console.log(req);
            order.find( {status:{$ne :'completed'}}, null, {sort: {'createdAt':-1}}).
            populate('customerId', '-password').exec((err, orders) => {
                if(req.xhr){
                    return res.json(orders)
                }
                else{
                     // to get info of cutomer
                    return res.render('admin/orders')
                }
            })  
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
                    res.render('admin/adminAccount')                    
                }
            })
        }
    }
}

module.exports = orderController