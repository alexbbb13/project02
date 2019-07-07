var express = require('express');
var router = express.Router();
const session = require('express-session');

/* GET upload. */
router.get('/', function(req, res, next) {
	if (req.session) {
		const userId = req.session.userId;
		const userName = req.session.userName;
		res.render('upload', {});		
	} else {
		res.redirect('/login');
	}   
});

/* POST upload. */
router.post('/', function(req, res, next) {
	if (req.session) {
		const userId = req.session.userId;
		const userName = req.session.userName;		
	} else {
		res.redirect('/login');	
	}   
	
});
module.exports = router;
