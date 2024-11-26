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

router.get('/dashboard/item/:id',isLoggedIn,(req,res)=>{
    let noteId = req.params.id;
    userHelper.getNoteById(noteId).then((note)=>{
        res.render('user/viewNotes',{note})
    })
})

router.get('/dashboard/add',isLoggedIn,(req,res)=>{
    res.render('user/addnotes')
});

router.post('/dashboard/add',(req,res)=>{
    let userid = req.user.id;
    userHelper.addNotes(req.body,userid).then((notes)=>{
        console.log('added notes')
        res.redirect('/dashboard')
    });
});

router.post('/dashboard/item/update/:id',(req,res)=>{
    let noteId = req.params.id;
    let newNote = req.body;
    userHelper.updateNoteById(noteId,newNote).then((response)=>{
        console.log('note updated');
        res.redirect('/dashboard');
    });
});


router.post('/dashboard/item/delete/:id',(req,res)=>{
    let noteId = req.params.id;
    console.log(noteId);
    
    userHelper.deleteNoteById(noteId).then((response)=>{
        if(response.deletedCount > 0){
            console.log('note deleted');
            res.redirect('/dashboard');
        }else{
            console.log('note not deleted');
            res.status(500).send('note not deleted');
        }; 
    });
});



module.exports = router;