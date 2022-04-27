// DEPENDENCIES
const express = require('express');
const methodOverride = require('method-override')
const { urlencoded } = require('express');
const session = require('express-session')
const cors = require('cors');
const morgan = require('morgan');
const MongoDBStore = require('connect-mongodb-session')(session)
require('dotenv').config();
require('./db-utils/connect')
const app = express();
app.use(cors());

const User = require('./models/user')

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'mySessions'
});

app.use(express.static("public"));
app.use(require('./middleware/logger'))
// const isLoggedIn = require('./middleware/isLoggedIn')
// app.use(require('./middleware/isLoggedIn'))
app.use(morgan('short'));
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const bookController = require('./controllers/bookController')
const userController = require('./controllers/userController')

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

app.use('/books', bookController)
app.use('/user', userController)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log('app is running! better go catch it on port', port);
});