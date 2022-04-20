// DEPENDENCIES
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const morgan = require('morgan');
const { urlencoded } = require('express');
const MongoDBStore = require('connect-mongodb-session')(session)
const app = express();
require('dotenv').config();
app.use(cors());

// DATABASE
const mongoURI = process.env.MONGO_URI;
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'mySessions'
});
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},
() => console.log('MongoDB connection established:', mongoURI)
);
const db = mongoose.connection;
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// CONTROLLERS
const bookController = require('./controllers/bookController')

// MIDDLEWARE
app.use(express.static("public"));
app.use(morgan('short'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(async (req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn
    if (req.session.isLoggedIn) {
        const currentUser = await User.findById(req.session.userId)
        res.locals.username = currentUser.username
        res.locals.userId = req.session.userId.toString()
    }
    next()
})


// ROUTES
app.use('/books', bookController)
app.get('/', (req, res)=>{
    res.redirect('/books')
})

const port = process.env.PORT;

app.listen(port, () => {
    console.log('app is running! better go catch it on port', port);
});