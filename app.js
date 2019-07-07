var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

var indexRouter = require('./routes/index');
var commentsRouter = require('./routes/photo_comments');
var loginRouter = require('./routes/login');
var uploadRouter = require('./routes/upload');

var app = express();

app.use(function (req, res, next) {
  console.log(req.body) // populated!
  next();
})

app.use(bodyParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//SESSION SHOULD BE CALLED BEFORE ROUTER 
//https://stackoverflow.com/questions/39796228/req-session-is-undefined-using-express-session
const hour = 3600000;
app.use(session(
{
  secret: 'ssshhhhhwq7365417236#12e3@',
  saveUninitialized: true,
  maxAge: 14 * 24 * hour
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
