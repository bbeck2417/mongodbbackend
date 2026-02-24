const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3100;
const app = express();
const bodyParser = require("body-parser");
const Song = require("./models/songs");
app.use(cors());
app.use(bodyParser.json());
const router = express.Router();

//grab all the songs in a database
// router.get("/songs", (req, res) => {
//     let query = {};
//     if (req.query.genre){
//         query = {genre : req.query.genre}
//     }
//     // to find all songs just use the find() method built into mongoose
//      Song.find(query, (err, songs) => {
//         if (err) {
//             res.status(400).send(err)
//         }
//         else {
//             res.json(songs)
//         }
//      })
// })
router.get("/songs/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    res.json(song);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.get("/songs", async (req, res) => {
  let query = {};
  if (req.query.genre) {
    query = { genre: req.query.genre };
  }

  try {
    const songs = await Song.find(query);
    res.json(songs);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/songs", async (req, res) => {
  try {
    const newSong = new Song(req.body);
    const savedSong = await newSong.save();

    res.status(201).json(savedSong);
    // Deleted res.sendStatus(204) here!
  } catch (err) {
    res.status(400).send(err);
  }
});

// Added the forward slash here!
router.put("/songs/:id", async (req, res) => {
  try {
    const song = req.body;
    await Song.updateOne({ _id: req.params.id }, song);

    console.log(song);
    // Added this response so the frontend knows it was successful!
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.use("/api", router);
app.listen(port, function () {
  console.log(`Listening on port ${port}.`);
});
