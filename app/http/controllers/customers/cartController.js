const Order = require('../../../models/order');

function cartController(){
    return {
        index(req,res) {
            res.render('customers/cart');
        },
        update(req,res){
            // for the first time adding cart
            if(!req.session.cart){
                req.session.cart = {
                    items:{},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart
                
            // Check if item exists in the cart
            if(!cart.items[req.body._id]){
                    cart.items[req.body._id] = {
                        item: req.body,
                        qty: 1
                    }
                    cart.totalQty = cart.totalQty+1;
                    cart.totalPrice = parseInt(cart.totalPrice)+parseInt(req.body.price);
            }
            else{
                cart.items[req.body._id].qty = cart.items[req.body._id].qty+1;
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = parseInt(cart.totalPrice) + parseInt(req.body.price); 
            }
            return res.json({totalQty: req.session.cart.totalQty})
        },
        deleteItem(req,res){
            // var productId = req.body.item.id;
            // const prodId = req.body.item._id
            // var cart = req.session.cart
            // console.log("Req params = ",prodId)
            // console.log("cart = ",cart)


            // // Check if item exists in the cart
            // if(!cart.items[req.body._id]){
            //     cart.items.slice(0,1)
            //     console.log("Item exists in the cart")
            // }
        }
    }    
}

module.exports = cartController