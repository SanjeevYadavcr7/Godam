require('dotenv').config();   // accessing .env file in root directory
const express = require('express'); // including express module
const app = express(); // storing express object to access its function
const path = require('path');
const ejs = require('ejs'); // including template engine
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3300; // setting port to 3000 using PORT variable 
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');  // middleware
const MongoDbStore = require('connect-mongo')(session)  // passing session variables to mongodb
const passport = require('passport');
const Emitter = require('events');

// mongodb+srv://Sanjeev:sanjeev@7@godam.1uwvm.mongodb.net/sessions?retryWrites=true&w=majority

// Database Connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology:true, useFindAndModify:true}
    );
const connection = mongoose.connection;
connection.once('open',() => {
    console.log('DB Connected...');
}).catch(err => {
    console.log('Connection falied...')
});



// Session Store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'     //  creating sessions table in mongoDB to store session_id and TTL
})


// Event emitter for enabling use of sockets in statusController.js to provide real time comm
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)  // binding eventEmitter with app to provide its global access all over the app


// Session Config
app.use(session({
    secret: process.env.COOKIE_SECRET,  // for cookies encryption - cookies stored during session
    resave: false,
    store: mongoStore,   // storing session_id in mongoStore
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24}  //cookie timeline 24 hrs
}))


// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


// Using express-flash middleware for sessions
app.use(flash())
app.use(express.json())   // for json type data
app.use(express.urlencoded({extended: false}))  // for form-data



// Global middleware for allowing global access of sesssion variables in every page
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user  // for allowing global access of user
    next()
})


// Assets
app.use(express.static('public'))

// setting template engine
app.use(expressLayout);
app.set('views', path.join(__dirname,'/resources/views'));
app.set('view engine', 'ejs');

require('./routes/web')(app)   // Setting routes in web.js

app.use((req,res) => {
    res.status(404).render('errors/404')
})

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`); 
})


// Socket connection

const io = require('socket.io')(server)   // connecting socket to server
io.on('connection', (socket) => {
    // Join room with orderID
    console.log(socket.id)
    socket.on('join', (orderId) => {      // receiving 'join' event sent fron app.js
        socket.join(orderId)   // creating private room of orderId
    })   
})


eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)   // sending to client i.e. app.js
})


eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})