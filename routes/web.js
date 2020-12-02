const authController = require('../app/http/controllers/authController');
const accountController = require('../app/http/controllers/accountController');
const itemCategory = require('../app/http/controllers/itemCategory');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const homeController = require('../app/http/controllers/homeController');
const AdminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');
const addProductController = require('../app/http/controllers/admin/addProductController')
// importing guest middleware to unable redirection too login and register page if user is already logged in


// Middlewares
const guest = require('../app/http/middleware/guest'); 
const auth = require('../app/http/middleware/auth'); 
const admin = require('../app/http/middleware/admin'); 

function initRoutes(app){
    
    app.get('/', homeController().index);   
    app.get('/login', guest, authController().login);
    app.post('/login', authController().postLogin);
    app.post('/changePassword', authController().changePwd);
    app.get('/register', guest, authController().register);
    app.post('/register', authController().postRegister);
    app.post('/logout', authController().logout);
        
    app.get('/cart', cartController().index);
    app.post('/update-cart',cartController().update);
    app.post('/delete-cart', cartController().deleteItem);

    app.get('/Category/:id', itemCategory().index);

    // Customer routes
    app.post('/orders', auth, orderController().store);
    app.get('/customer/orders', auth, orderController().index);
    app.get('/customer/customerAccount', auth, orderController().indexProfile);
    app.get('/customer/customerAccount/changePwd', auth, orderController().changePwd);
    app.get('/customer/orders/:id', auth, orderController().show);

    // Admin routes
    app.get('/admin/adminAccount', AdminOrderController().indexProfile); 
    app.get('/admin/orders', admin, AdminOrderController().index);
    app.post('/admin/order/status', admin, statusController().update);
    app.get('/admin/addProduct', admin, addProductController().index)
    app.post('/admin/addProduct', admin, addProductController().addProd);

}

module.exports = initRoutes