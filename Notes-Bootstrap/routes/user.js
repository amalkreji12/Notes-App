const express = require('express');
const router = express.Router();
const {isLoggedIn} =  require('../middleware/checkAuth')


router.get('/',(req,res)=>{
    res.render('user/home')
})

router.get('/dashboard',isLoggedIn,(req,res)=>{
    let user = req.user.firstName;
    
    res.render('user/dashboard',{user})
})




module.exports = router;