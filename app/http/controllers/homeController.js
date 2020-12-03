const Menu = require('../../models/menu');   // importing data from  models

function homeController(){
    return {
        async index(req,res) {

            const pizzas = await Menu.find().catch(e => { console.log(e) })
            return res.render('home',{pizzas:pizzas});

            // Another method to fetch data without using async await()
            // Menu.find().then(function(pizzas){
            //     console.log(pizzas)
            //     res.render('home',{pizzas:pizzas});
            // })
        }
    }    
}

module.exports = homeController