var express		= require('express'),
	path        = require('path'),
	nodemailer  = require('nodemailer'),
	validator	= require('validator'),
	csrf        = require('csurf');

var getHtmlMail = require('../lib/getHtmlMail');

var router 	= express.Router();
var config  = require(path.join(__dirname, '../config.json'));

var mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmail.username,
        pass: config.gmail.password
    }
});

router.route('/')
	.get(function (req, res) {
	    res.render('index', {
	        title  : 'Feedback',
	        csrf   : req.csrfToken()
	    });
	})
	.post(function (req, res) {
		if (validator.isEmail(req.body.email)) {
			getHtmlMail(req.body.name, req.body.email, req.body.body, function (htmlBody) {
				mailer.sendMail({
					from: config.mailbot.from,
					to: config.mailbot.to,
					subject: config.mailbot.subj,
					html: htmlBody
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
		} else if (!req.body.name) {
			res.send({title: 'Упс…', msg: 'Анон не пройдет!', status: 'error'});
		} else if (!req.body.body) {
			res.send({title: 'Упс…', msg: 'Мне нравится когда мне что-то пишут…', status: 'error'});
		} else {
			res.send({title: 'Упс…', msg: 'Укажите корректную эл.почту', status: 'error'});
		}
});

module.exports = router;