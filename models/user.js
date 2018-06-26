//requiring mongoose and mongoose schema so we can use it in the file
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//the user schema
const userSchema = new Schema({
  firstNeighm: { type: String },
  lastNeighm: { type: String },
  address: { type: String, required: true },
  location: { type: { type: String }, coordinates: [Number] },
  email: { type: String, required: true },
  password: { type: String, required: true }
});
userSchema.index({ location: "2dsphere" });

//set timestamps for the user schema
userSchema.set("timestamps", true);

//create user model with user schema
const User = mongoose.model("User", userSchema);

//export the model so we can use it in other files
module.exports = User;
