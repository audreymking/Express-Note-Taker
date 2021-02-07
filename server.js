//get the express library
const express = require("express");
//get path built in node package
const path = require("path");

//instacne of express object
const app = express();

//specify channel to listen too
const PORT = process.env.PORT || 8000;

//configure body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//present the public folder to the client
app.use(express.static(path.join(__dirname, "/public")));

//Routing
app.use(require("./routes/api-routes"));
app.use(require("./routes/html-routes"));

//listen to the server
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
