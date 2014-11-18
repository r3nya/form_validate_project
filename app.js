var express     = require('express'),
    jade        = require('jade'),
    csrf        = require('csurf'),
    bodyParser  = require('body-parser'),
    session     = require('express-session'),
    cookie      = require('cookie-parser'),
    nodemailer  = require('nodemailer');

var app     = express();
var port    = process.env.PORT || 3000;

app.use(session({secret: 'blablabla'}));
app.use(cookie());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(csrf());

app.set('view engine', 'jade');

app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    res.status(403);
    res.send('session has expired or form tampered with');
});

app.get('/', function (req, res) {
    res.render('index', {
        title  : 'Feedback',
        csrf   : req.csrfToken()
    });
});

//app.post('/', function (req, res) {
//
//});

// catch 404
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(port);
console.log('The magic happens on port ' + port);