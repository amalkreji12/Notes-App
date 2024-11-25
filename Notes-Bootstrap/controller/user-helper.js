const Note = require('../models/notesModel');
const mongoose = require('mongoose');

module.exports = {

    addNotes(notes,userId){
        return new Promise(async(resolve,reject)=>{
            notes.user = userId;
            await Note.create(notes);
            resolve();
        });
    },

    getAllNotes(userId){
        
    }





}