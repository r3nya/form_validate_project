var express     = require('express'),
    jade        = require('jade'),
    csrf        = require('csurf'),
    bodyParser  = require('body-parser'),
    path        = require('path'),
    session     = require('express-session'),
    cookie      = require('cookie-parser'),
    nodemailer  = require('nodemailer');

var getHtmlMail = require('./lib/getHtmlMail');

var config  = require(path.join(__dirname, 'config.json'));

var app     = express();
var port    = process.env.PORT || 3000;

app.use(session({secret: 'blablabla'}));
app.use(cookie());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(csrf());

app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    res.status(403);
    res.send('session has expired or form tampered with');
});

var mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmail.username,
        pass: config.gmail.password
    }
});

app.get('/', function (req, res) {
    res.render('index', {
        title  : 'Feedback',
        csrf   : req.csrfToken()
    });
});

app.post('/', function (req, res) {
    getHtmlMail(req.body.name, req.body.email, req.body.body, function(htmlBody) {
        mailer.sendMail({
            from    : config.mailbot.from,
            to      : config.mailbot.to,
            subject : config.mailbot.subj,
            html    : htmlBody
        }, function (err, info) {
            if (err) {
                console.log('Mail error: ', err);
                res.status(500);
                res.send({title: 'Упс…', msg: 'Почта сломалась…', status: 'error'});
            } else {
                console.log('Message sent: ', info.response);
                res.send({title: 'Фух!', msg: 'Сообщение отправлено.', status: 'success'});
            }
        });
    });
});

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