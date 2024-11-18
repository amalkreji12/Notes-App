const express = require('express');
const router = express.Router();


router.get('/',(req,res)=>{
    res.render('user/home')
})

router.get('/dashboard',(req,res)=>{
    res.render('user/dashboard',{user:true})
})




module.exports = router;