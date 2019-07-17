var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const { body } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
var PORT = process.env.PORT || 3000;

var indexRouter = require('./routes/index');
var commentsRouter = require('./routes/photo_comments');
var loginRouter = require('./routes/login');
var uploadRouter = require('./routes/upload');
var signS3Router = require('./routes/sign-s3');

var app = express();

app.disable('x-powered-by');  //https://expressjs.com/en/advanced/best-practice-security.html

app.use(function (req, res, next) {
  console.log(req.body) // populated!
  next();
})

app.use(fileUpload({
	useTempFiles : false
}));

app.use(bodyParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//SESSION SHOULD BE CALLED BEFORE ROUTER 
//https://stackoverflow.com/questions/39796228/req-session-is-undefined-using-express-session
//https://expressjs.com/en/advanced/best-practice-security.html
var expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
app.use(session(
{
  secret: 'ssshhhhhwq7365417236#12e3@',
  saveUninitialized: true,
  httpOnly: true,
  expires: expiryDate
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/photo_comments', commentsRouter);
app.use('/login', loginRouter);
app.use('/login/checkuser', loginRouter);
app.use('/login/newuser', loginRouter);
app.use('/upload', uploadRouter);
app.use('/sign-s3', signS3Router);

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

app.listen(PORT);

module.exports = app;
