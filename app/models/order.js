const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema =  new Schema({
    // making connection in customer and user
    customerId:{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true   
            },
    items: {type: Object, required: true},  // items from cart
    phone: {type: String, required:true},
    address: {type: String, required:true},
    paymentType: {type: String, default: 'COD'},
    status: {type: String, default: 'order_placed'},
}, {timestamps: true})

const Order = mongoose.model('Order',orderSchema)
module.exports = Order