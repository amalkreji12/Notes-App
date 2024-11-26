const express = require('express');
const router = express.Router();
const {isLoggedIn} =  require('../middleware/checkAuth')
const userHelper = require('../controller/user-helper')


router.get('/',(req,res)=>{
    res.render('user/home')
})

router.get('/dashboard',isLoggedIn,(req,res)=>{
    let user = req.user.firstName;
    let userId = req.user.id;
    userHelper.getAllNotes(userId).then((notes)=>{
        // if(notes.length > 0){
        //     console.log('notes get');
        // }else{
        //     console.log('no notes');
        // }
        res.render('user/dashboard',{user,notes});
    })
    
});

router.get('/dashboard/item/',isLoggedIn,(req,res)=>{
    res.render('user/viewNotes')
})

router.get('/dashboard/add',isLoggedIn,(req,res)=>{
    res.render('user/addnotes')
});

router.post('/dashboard/add',(req,res)=>{
    let userid = req.user.id;
    userHelper.addNotes(req.body,userid).then((notes)=>{
        console.log('added notes')
        res.redirect('/dashboard')
    })
    
})




module.exports = router;