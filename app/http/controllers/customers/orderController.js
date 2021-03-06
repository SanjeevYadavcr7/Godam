const Order = require('../../../models/order');
const moment = require('moment');

function orderController(){
    return{
        store(req,res){
            // Validate request
            const { phone, address } = req.body 
            if(!phone || !address){
                req.flash('error','All fields are required')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })

            order.save().then(result => {
                Order.populate(result, { path:'customerId' }, (err,placedOrder) => {
                    req.flash('success','Order placed successfully')
                    delete req.session.cart  // making cart empty after order is being placed
    
                    // Emit 
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', placedOrder)
    
                    return res.redirect('/customer/orders')
                })
            }).catch(err => {
                req.flash('error','Something went wrong in order section')
                return res.redirect('/cart');
            })


        },
        async index(req,res){
            // receiving orders and passing sort object to sort orders using descending order of timestamps
            const orders = await Order.find({ customerId: req.user._id },
                null, { sort:{ 'createdAt': -1 } } ).catch(e => { console.log(e) })
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            res.render('customers/orders',{orders:orders, moment:moment})
        },

        async show(req,res){
            const order = await Order.findById(req.params.id).catch(e => { console.log(e) })
            //  resticting user to check status of his own orders 
            if(req.user._id.toString() === order.customerId.toString()){
                return res.render('customers/sinleOrder', {order})
            }
                return res.redirect('/')
        },
        async indexProfile(req,res){
            const orders = await Order.find({ customerId: req.user._id },
                null, { sort:{ 'createdAt': -1 } } ).catch(e => { console.log(e) })
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            res.render('customers/customerAccount',{orders:orders, moment:moment})
        },
        changePwd(req,res){
            res.render('customers/changePwd');
        }
    }
}

module.exports = orderController