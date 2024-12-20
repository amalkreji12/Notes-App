const Note = require('../models/notesModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

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
                            body: newNote.body,
                            updatedAt: Date.now(),
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
    },

    getNotesToDashboard(userId){
        return new Promise(async(resolve,reject)=>{
            try {
                const notes = await Note.aggregate([
                    {$sort: {  updatedAt :-1}},
                    {$match: {user:new mongoose.Types.ObjectId(userId)}},
                    {
                        $project:{
                            title: {$substr:["$title",0,30]},
                            body:{$substr:["$body",0,100]},
                        },
                    }
                ]);
                resolve(notes);
            } catch (error) {
                reject(error);
            }
        })
    },


    searchNotesByUser(searchWord,userId){
        return new Promise(async(resolve,reject)=>{
            try {
                let searchTerm = searchWord.replace(/[^a-zA-Z0-9]/g,'_');

                const notes = await Note.find({
                    $or :[
                        {title:{$regex:new RegExp(searchTerm,"i")}},
                        {body:{$regex:new RegExp(searchTerm,"i")}},
                    ]
                }).where({user:new mongoose.Types.ObjectId(userId)}).lean();
                resolve(notes);
            } catch (error) {
                console.error('Error deleting notes:', error);
                reject(error);
            };
        });
    },


    doSignUp(userData){
        return new Promise(async(resolve,reject)=>{
            try {
                userData.password = await bcrypt.hash(userData.password,10);
                userData.createdAt = new Date();
                let isUserExist = await User.findOne({email:userData.email});
                if(isUserExist){
                    console.log('User already exists');
                    resolve({status:false,userExists:true});
                }else{
                    let user = await User.create(userData);
                    resolve(user);
                }
            } catch (error) {
                console.error('Error deleting notes:', error);
                reject(error);
            }
        })
    },

    doLogin(userData){
        return new Promise(async(resolve,reject)=>{
            try {
                let loginStatus = false;
                let response = {};
                let user = await User.findOne({email:userData.email});
                if(user){
                    bcrypt.compare(userData.password,user.password).then((status)=>{
                        if(status){
                            console.log('login successful');
                            response.user = user
                            response.status= true;
                            resolve(response);
                        }else{
                            console.log('login failed');
                            resolve({status:false});
                        }
                    })
                }else{
                    console.log('User not found');
                    resolve({status:false,emailNotFound:true});
                    
                }
            } catch (error) {
                console.error('Error deleting notes:', error);
                reject(error);
            }
        })
    }





}