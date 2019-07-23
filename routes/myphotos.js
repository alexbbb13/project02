var express = require('express');
var router = express.Router();

/* GET home page. - redirecting to user's photos*/

router.get('/', function(req, res, next) {
const session = require('express-session');
if(req.session && req.session.userId) {
        const userId = req.session.userId;
        res.redirect('/photos/' + userId);
    //session not found    
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
