const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  age: Number,
  bio: String,
  profileImage: String, // ✅ NEW field to store profile image filename
});

module.exports = mongoose.model("User", UserSchema);
