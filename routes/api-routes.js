const util = require("util");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

//promisify fs functions
const promisifiedRead = util.promisify(fs.readFile);
const promisifiedWrite = util.promisify(fs.writeFile);

//get notes from array
const getNotes = () => {
  return promisifiedRead("db/db.json", "utf8").then((notes) => {
    return JSON.parse(notes);
  });
};

//add notes
const addNote = (note) => {
  //gives individual notes an id
  const newNote = note;
  newNote.id = uuidv4();

  return getNotes().then((notes) => {
    //push the notes together
    const allNotes = notes;
    allNotes.push(newNote);
    promisifiedWrite("db/db.json", JSON.stringify(allNotes));
  });
};

//removes id of removed notes
const destroyNote = (id) => {
  return getNotes().then((notes) => {
    const allNotes = notes;
    const filteredNotes = allNotes.filter((note) => note.id !== id);
    promisifiedWrite("db/db.json", JSON.stringify(filteredNotes));
  });
};

//connects express to router
const router = require("express").Router();

//get notes from router
router.get("/api/notes", (req, res) => {
  getNotes().then((notes) => {
    res.json(notes);
  });
});

//post notes to router
router.post("/api/notes", (req, res) => {
  addNote(req.body).then((notes) => {
    res.json(notes);
    console.log("Saving note to database with the id of: " + req.body.id);
  });
});

//delete notes from router
router.delete("/api/notes/:id", (req, res) => {
  destroyNote(req.params.id).then((notes) => {
    res.json(notes);
    console.log("Deleting note from the database with the id of " + req.params.id);
  });
});

module.exports = router;
