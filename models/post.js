//requiring mongoose and mongoose schema so we can use it in the file
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//the post schema
const postSchema = new Schema({
  text: { type: String, required: true },
  _owner: { type: Schema.Types.ObjectId, ref: "User" },
  _comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});


//set timestamps for the user schema
postSchema.set("timestamps", true);

//create user model with user schema
const Post = mongoose.model("Post", postSchema);

//export the model so we can use it in other files
module.exports = Post;
