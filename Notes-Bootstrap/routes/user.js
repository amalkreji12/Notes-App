const express = require('express');
const router = express.Router();
const {isLoggedIn} =  require('../middleware/checkAuth')


router.get('/',(req,res)=>{
    res.render('user/home')
})

router.get('/dashboard',isLoggedIn,(req,res)=>{
    res.render('user/dashboard',{user:true})
})




module.exports = router;