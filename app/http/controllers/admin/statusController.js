const Order = require('../../../models/order');

// for updating the status of order at admin side
function statusController(){
    return{
        update(req,res){
            Order.updateOne({_id: req.body.orderId}, {status: req.body.status}, (err, data) => {
                if(err){
                    return res.redirect('/admin/orders')
                }
                // Emit event
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', {id: req.body.orderId, status: req.body.status})
                return res.redirect('/admin/orders')
            })
        }
    }
}

module.exports = statusController