const express = require('express');
// Configuring environment variables
const dotenv = require('dotenv');
dotenv.config();

const exphbs = require('express-handlebars').create;
const HandleBars = require('handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const homeRouter = require('./routes/homeRoutes');
const posterRouter = require('./routes/posterRoutes');
const authRouter = require('./routes/authRoutes');
const profileRouter = require('./routes/profileRoutes');
const connectDB = require('./config/db');
const multer = require('multer');
const flash = require('connect-flash');
const hbsHelpers = require('./utils/hbsHelpers');
const helmet = require('helmet');
const compression = require('compression');

// Initializing express
const app = express();

// Initializing session store
const store = new MongoStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions',
})

store.on('error', function(error) {
    console.error('Session store error:', error);
});


// Middlewares are integrated below
app.use(flash());

// Integrate helmet for security
app.use(helmet());

// Integrate compression
app.use(compression());

// To read Request body
app.use(express.json());
app.use(express.urlencoded({extended: false})); // this is used with server-rendered pages like exp-handlebars

// Connecting Frontend
app.use(express.static('public'))


//register handlebars helpers
hbsHelpers(HandleBars);

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
}));

// ConnectDB
connectDB()


// Configuring the engine
const hbs = exphbs({ extname: '.hbs', helpers: {
    equal: (a,b)=> a.toString() === b.toString(),
    notEqual: (a,b)=> a.toString() !== b.toString()
}});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs')

// Routes
app.use('/', homeRouter);
app.use('/posters', posterRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);



// PORT
const port = process.env.PORT || 3001;


// Starting the server
app.listen(port, ()=> {
    console.log("Server is listening on port " + port)
});