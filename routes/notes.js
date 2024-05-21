const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

// Get all notes
router.get('/fetchAllNotes',fetchUser,async (req,res)=>{
    try {
        const notes = await Notes.find({user:req.user.id})
        res.json(notes) 
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
    
})

// Post notes of an user
router.post('/addNote',fetchUser,[
    body('title').isLength({min:3}),
    body('description').isLength({min:10,max:1000})
],async (req,res)=>{
    try {
        const {title,description,tag} = req.body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

router.put('/updateNote/:id', fetchUser, async (req, res) => {
    try {
        const { title, tag, description } = req.body;
        const newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note not found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note); // Return just the updated note directly
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

//Delete a note using id of the note

router.delete('/deleteNote/:id', fetchUser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note not found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        await Notes.findByIdAndDelete(req.params.id); 
        res.json({ message: "Note deleted" }); 
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router