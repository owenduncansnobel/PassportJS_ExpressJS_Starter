const { Router } = require('express');
const passport = require('passport'); 

const router = Router();

router.post('/login', passport.authenticate('local', {redirectFailure: '/login'}), (req, res) => {
    res.json(req.user);
})

module.exports = router;