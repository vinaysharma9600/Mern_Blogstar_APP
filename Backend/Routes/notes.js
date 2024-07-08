const express = require("express");
const router = express.Router();
const Note = require("../Models/Notes");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");

//Route 1: Get All the Notes using : GET "/api/auth/getuser" login Required
router.get("/fetchallNotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server Error Occured");
  }
});

//Route 2: Add a new Note using:Post: "api/notes/addNotes" Login Required
router.post(
  "/addNotes",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({
      min: 5,
    }),
    body("description", "Description must be at least 5 char").isLength({
      min: 20,
    }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server Error Occured");
    }
  }
);

//Route 3: Update a Note using:Put: "api/notes/update" Login Required
router.put(
  "/update/:id",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({
      min: 5,
    }),
    body("description", "Description must be at least 5 char").isLength({
      min: 20,
    }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //creating a new Note Object
    try {
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
      //find the note to be updated and update it
      let note = await Note.findById(req.params.id);
      //authe
      if (!note) {
        return res.status(404).send("Not Found");
      }
      //authentication for user
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Operation Not allowed");
      }
      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );

      res.json({ note });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server Error Occured");
    }
  }
);

//Route 4: Delete a Note using:Delete: "api/notes/delete/:id" Login Required

router.delete(
  "/delete/:id",
  fetchuser,

  async (req, res) => {
    try {
      // find the Note to be updated and delete it
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not found");
      }
      // Allow Deletion only if user owns this Delete Note
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }
      note = await Note.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted Successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server Error Occured");
    }
  }
);

module.exports = router;
