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

    const deleteNoteAlert = req.flash('successDelete')[0] || null;
    const updateNoteAlert = req.flash('successUpdate')[0] || null;
    const addNoteAlert = req.flash('successAdd')[0] || null;

    const alertMessage = {deleteNoteAlert,updateNoteAlert,addNoteAlert}

    userHelper.getAllNotes(userId).then((notes)=>{
        res.render('user/dashboard',{user,notes,alertMessage});
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
        req.flash('successAdd','Note added successfully');
        res.redirect('/dashboard')
    });
});

router.post('/dashboard/item/update/:id',(req,res)=>{
    let noteId = req.params.id;
    let newNote = req.body;
    userHelper.updateNoteById(noteId,newNote).then((response)=>{
        req.flash('successUpdate','Note updated successfully')
        res.redirect('/dashboard');
    });
});


router.post('/dashboard/item/delete/:id',(req,res)=>{
    let noteId = req.params.id;
    
    userHelper.deleteNoteById(noteId).then((response)=>{
        if(response.deletedCount > 0){
            req.flash('successDelete','Note deleted successfully');
            res.redirect('/dashboard');
        }else{
            console.log('note not deleted');
            res.status(500).send('note not deleted');
        }; 
    });
});



module.exports = router;