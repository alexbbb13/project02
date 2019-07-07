var express = require('express');
const session = require('express-session');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session && req.session.userName && req.session.userId) {
		const userId = req.session.userId;
		const userName = req.session.userName;
		res.render('index', { title: 'PhotoGram', userId:userId, userName:userName });
	} else {
		res.redirect('/login');
	}   
});

module.exports = router;
