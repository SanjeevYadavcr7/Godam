const order = require('../../../models/order');
const Menu = require('../../../models/menu');

function addProductController(){
    return{
        index(req,res){
           return res.render('admin/addProd');
        },
        addProd(req,res){
            console.log('Hello in addProd')
            const { name, image, price, size, type } = req.body
            // validate request
            if(!name || !image|| !price || !size || !type){
                req.flash('error','All fields are required')
                req.flash('name', name)
                req.flash('price', image)
                req.flash('price', price)
                return res.redirect('/admin/addProduct')
            }

            // Check if item exists
            Menu.exists({name: name}, (err, result) => {
                if(result){
                    req.flash('error','Item already exists')
                    return res.redirect('/admin/addProduct')
                }
            })

            // Create a item if everything is all right
            const menu = new Menu({name,image,price,size,type})
            menu.save().then((menu) => {
                return res.redirect('/')
            }).catch(err => {
                req.flash('error','Error : This product cannot be added')
                return res.redirect('/admin/addProduct')
            })
        }
    }
}

module.exports = addProductController