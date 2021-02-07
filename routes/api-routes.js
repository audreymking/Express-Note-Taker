const util = require("util");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

//promisify fs functions
const promisifiedRead = util.promisify(fs.readFile);
const promisifiedWrite = util.promisify(fs.writeFile);

//get notes
const getNotes = () => {
  return promisifiedRead("db/db.json", "utf8").then((notes) => {
    return JSON.parse(notes);
  });
};

//add notes to
const addNote = (note) => {
  //odify the notes to have id
  const newNote = note;
  newNote.id = uuidv4();

  return getNotes().then((notes) => {
    //push the notes together
    const allNotes = notes;
    allNotes.push(newNote);
    promisifiedWrite("db/db.json", JSON.stringify(allNotes));
  });
};

const destroyNote = (id) => {
  return getNotes().then((notes) => {
    const allNotes = notes;
    const filteredNotes = allNotes.filter((note) => note.id !== id);
    promisifiedWrite("db/db.json", JSON.stringify(filteredNotes));
  });
};

const router = require("express").Router();

router.get("/api/notes", (req, res) => {
  getNotes().then((notes) => {
    res.json(notes);
  });
});

router.post("/api/notes", (req, res) => {
  addNote(req.body).then((notes) => {
    res.json(notes);
  });
});

router.delete("/api/notes/:id", (req, res) => {
  destroyNote(req.params.id).then((notes) => {
    res.json(notes);
  });
});

module.exports = router;
