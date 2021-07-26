const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./models');
const { Book } = db;

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
/**
 * check if db connected sucessfully and rebuild db after each restart. 
 * db will will be empty.
 */
(async () => {
  try {
    await db.sequelize.sync({ force: true });
    console.log('  <<< Connection to the database establised! >>>');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();
const app = express();
// init db
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter); //index route that will redirect to /books
app.use('/books', booksRouter); // upper level books route which will handle all crud op

// catch 404 and forward to error handler
app.use( (req, res, next)=> {
  const error = new Error();
  error.message = `Page Not Found for url: ${req.url}`;
  error.status = 404;
  next(error);
});

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  const notFound = 404;
  const internalError = 500;
  const catchAllError = new Error()

  // if there are no error status from other middleware function
  // assume an internal error happened
  if(!err.status){
      catchAllError.message = "Internal Server Error";
      catchAllError.status = internalError;
      catchAllError.stack = err.stack;
  }else {
    // set message from non found err sent by previous  middleware function
    catchAllError.message = err.message;
    catchAllError.status = notFound;
    catchAllError.stack = err.stack;

  }
  res.locals.error = catchAllError;
  res.status(catchAllError.status);

  console.log('+ + + error + + +');
  console.log(catchAllError);
  // if error message is 404 render page-not-found and error otherwise. 

  res.locals.error = req.app.get('env') === 'development' ? catchAllError : {};
  console.log(catchAllError);
  catchAllError.status === notFound
        ? res.render('page-not-found',catchAllError) 
        : res.render('error',catchAllError);
});

module.exports = app;
