/**
 * System and 3rd party libs
 */
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
const fs = require('fs');
let mongoose = require('mongoose');
const cors = require('cors');
const {authenticate} = require('./services/authenticate');
 
 //router..
 const router = express.Router();
 // model require..
const {User} = require ('./models/user.model')

/**
 * Required Services
 */
let Logger = require('./services/logger');

/**
 * Global declarations
 */
let models = path.join(__dirname, 'models');
let dbURL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/Database';

/**
 * Bootstrap Models
 */
fs.readdirSync(models)
    .forEach(file => require(path.join(models, file)));


/**
 * Bootstrap App
 */
let app = express();

//CORS
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', ' X-Requested-With', ' Content-Type', ' Accept ', ' Authorization'],
    credentials: true
}));

app.use(Logger.morgan);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', router);

/**
 * Import and Register Routes
 */
let index = require('./routes/index');
let post = require('./routes/post');
let get = require('./routes/get');
let patch = require('./routes/patch');
app.use('/', index);
app.use('/', post);
app.use('/', get);
app.use('/', patch);



/**
 * Catch 404 routes
 */
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  

  /**
 * Error Handler
 */

// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     res.status(err.status || 500);
//     res.json(err);
//   });
  


  /**
 * Mongoose Configuration
 */
mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
    Logger.log.info('DATABASE - Connected');
});    

mongoose.connection.on('error', (err) => {
    Logger.log.error('DATABASE - Error:' + err);
});

mongoose.connection.on('disconnected', () => {
    Logger.log.warn('DATABASE - disconnected  Retrying....');
});

let connectDb = function () {
    const dbOptions = {
        poolSize: 5,
        reconnectTries: Number.MAX_SAFE_INTEGER ,
        reconnectInterval: 500,
        useNewUrlParser: true
    };
    mongoose.connect(dbURL, dbOptions)
        .catch(err => {
            Logger.log.fatal('DATABASE - Error:' + err);
        });
};

 


connectDb();

module.exports = app;