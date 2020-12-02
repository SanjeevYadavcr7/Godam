const Menu = require('../../models/menu');   // importing data from  models

function itemCategory(){
    return{
        async index(req,res){
            console.log("Request = ",req.url);
            let type;
            if(req.url == '/Category/rice'){
                type ={type:'Staples & Salt'}
            }
            if(req.url == '/Category/personalCare'){
                type ={type:'Personal Care'}
            }
            if(req.url == '/Category/instantFood'){
                type ={type:'Instant Food'}
            }
            if(req.url == '/Category/oil'){
                type ={type:'Edible Oil'}
            }
            if(req.url == '/Category/dryFruits'){
                type = {type:'Dry Fruits'}
            }
            if(req.url == '/Category/babyCare'){
                type = {type:'Baby Care'}
            }
            if(req.url == '/Category/beverages'){
                type = {type:'Beverages'}
            }
            const pizzas = await Menu.find()
            return res.render('categories',{pizzas:pizzas,type:type});
        }
    }
}

module.exports = itemCategory