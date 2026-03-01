const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");
const Song = require("./models/songs");
const User = require("./models/user");

const app = express();
const port = process.env.PORT || 3100;
const secret = process.env.SESSION_SECRET || "defaultsecretkey";

app.use(cors());
app.use(express.json()); // Built-in alternative to body-parser

const router = express.Router();

// --- USER REGISTRATION ---
router.post("/user", async (req, res) => {
  try {
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, passwordHash });
    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.encode({ id: user._id }, secret);
    res.json({ token });
  } catch (err) {
    res.status(400).send("Login failed"); // Fixed .status()
  }
});

// --- SONGS CRUD ---
router.get("/songs", async (req, res) => {
  try {
    const query = req.query.genre ? { genre: req.query.genre } : {};
    const songs = await Song.find(query);
    res.json(songs);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/songs/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).send("Song not found");
    res.json(song);
  } catch (err) {
    res.status(400).send("Invalid ID format");
  }
});
router.delete("/songs/:id", async (req, res) => {
  try {
    const result = await Song.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).send("Not found");
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send("Invalid ID");
  }
});
router.post("/songs", async (req, res) => {
  try {
    const newSong = new Song(req.body);
    await newSong.save();
    res.status(201).json(newSong);
  } catch (err) {
    res.status(400).send("Invalid song data");
  }
});

app.use("/api", router);
app.listen(port, () => console.log(`Server running on port ${port}`));
