// DEPENDENCIES
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const morgan = require('morgan');
const { urlencoded } = require('express');
const MongoDBStore = require('connect-mongodb-session')(session)
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
app.use(require('./middleware/logger'))
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

// ROUTES
app.use('/books', bookController)
app.get('/', (req, res)=>{
    res.redirect('/books')
})

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log('app is running! better go catch it on port', port);
});