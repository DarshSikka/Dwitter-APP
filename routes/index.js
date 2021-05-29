const express = require("express");
const Dweeter=require('../models/Dweeter');
const router = express.Router();
router.get('/',(req, res)=>{
    res.render("welcome");
});
router.get('/logout', (req, res)=>{
    res.clearCookie('results');
    res.clearCookie('legal');
    res.redirect('/');
});
module.exports = router;