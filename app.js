const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars')
const db = require('./config/connections')
const session = require('express-session')
const nocache =require('nocache')
const fileUpload = require('express-fileupload')

const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',layoutsDir:__dirname+'/views/layouts',usersDir:__dirname+'/views/users',adminDir:__dirname+'/views/admin',partialsDir:__dirname+'/views/partials/'}))

// Middleware

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({secret:"xoxo", resave:false, saveUninitialized:true, cookie:{ maxAge:60000000}}))
app.use(nocache())

// database connection

db.connect((err)=>{
  if(err)
    console.log('Database not connected'+err);
  else
    console.log('Database connected successfully');
})

app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
