const Note = require('../models/notesModel');
const mongoose = require('mongoose');

module.exports = {

    addNotes(notes, userId) {
        return new Promise(async (resolve, reject) => {
            notes.user = userId;
            await Note.create(notes);
            resolve();
        });
    },

    getAllNotes(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const notes = await Note.find({ user: userId }).lean();
                if (!notes) {
                    console.warn('No notes found')
                }
                resolve(notes);
            } catch (error) {
                console.error('Error fetching notes:', error);
                reject(error);
            }

        })
    },

    getNoteById(noteId) {
        return new Promise(async (resolve, reject) => {
            try {
                const note = await Note.findById({ _id: noteId }).lean();
                resolve(note);
            } catch (error) {
                console.error('Error fetching notes:', error);
                reject(error);
            };
        });
    },

    updateNoteById(noteId, newNote) {
        return new Promise(async (resolve, reject) => {
            try {
                const note = await Note.findByIdAndUpdate({ _id: noteId },
                    {
                        $set: {
                            title: newNote.title,
                            body: newNote.body
                        },
                    },
                    { new: true }
                );
                resolve(note);
                
            } catch (error) {
                console.error('Error updating notes:', error);
                reject(error);
            };
        });
    },


    deleteNoteById(noteId){
        return new Promise(async(resolve,reject)=>{
            try {
                let note = await Note.deleteOne({_id:noteId});
                resolve(note);
            } catch (error) {
                console.error('Error deleting notes:', error);
                reject(error);
            }
        })
    }





}