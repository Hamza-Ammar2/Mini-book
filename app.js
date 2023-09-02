require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const User = require('./models/users');
var mongoDB = 'mongodb+srv://express2:express2@library.svb9dc8.mongodb.net/facebook?retryWrites=true&w=majority';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var  mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) {return done(err);}
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/log-in', (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      // *** Display message using Express 3 locals
      req.session.message = info.message;
      return res.redirect('/log-in');
    }
    
    User.findById(user._id.toString())
      .populate('receivedRequests')
      .exec((Err, result) => {
        if (Err) {return next(Err);}
        req.logIn(result, function(err) {
          if (err) { return next(err); }
          return res.redirect('/');
        });
    });
  })(req, res, next);
});

app.post('/sign-up', (req, res, next) => {
  User.findOne({username: req.body.username}).exec((err, result) => {
    if (err) {return next(err);}
    if (result) {return res.render("sign-up", {message: "Username already taken."});}

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {return next(err);}
        let user = new User({
            username: req.body.username,
            password: hashedPassword,
            friends: [],
            friendRequests: [],
            pic: "",
            posts: [],
            comments: [],
            likedPosts: []
        });

        user.save((err, result) => {
            if (err) {return next(err);};
            passport.authenticate('local', function(err, user, info) {
              if (err) { return next(err) }
              if (!user) {
                // *** Display message using Express 3 locals
                req.session.message = info.message;
                return res.redirect('/log-in');
              }
              req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
              });
            })(req, res, next);
        });
    });
});
});

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
