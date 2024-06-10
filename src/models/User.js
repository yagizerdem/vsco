const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  profileImage: {
    type: String,
    default: null,
  },
});
schema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});
const User = mongoose.models.User || mongoose.model("User", schema);

export default User;
