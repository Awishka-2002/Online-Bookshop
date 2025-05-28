const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password, age, bio } = req.body;

  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send("User already exists.");

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashed,
      age,
      bio,
    });

    await user.save();
    res.status(201).send("User registered successfully.");
  } catch (err) {
    res.status(500).send("Registration error.");
  }
});

// LOGIN (with email or username)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email OR username
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });

    if (!user) return res.status(404).send("User not found.");

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send("Invalid password.");

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).send("Login error.");
  }
});

// PROTECTED PROFILE ROUTE
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).send("User not found.");
    res.json(user);
  } catch (err) {
    res.status(500).send("Failed to fetch profile");
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

router.put("/profile", verifyToken, upload.single("profileImage"), async (req, res) => {
  try {
    const updateData = {
      username: req.body.username,
      age: req.body.age,
      bio: req.body.bio,
    };

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Failed to update profile");
  }
});


module.exports = router;
