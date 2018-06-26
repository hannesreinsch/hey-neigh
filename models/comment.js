//requiring mongoose and mongoose schema so we can use it in the file
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//the post schema
const commentSchema = new Schema({
  text: {type: String, required: true},
  _owner: {type: Schema.Types.ObjectId, ref: "User"},
})

//set timestamps for the user schema
commentSchema.set("timestamps", true);

//create user model with user schema
const Comment = mongoose.model("Comment", commentSchema);


//export the model so we can use it in other files
module.exports = Comment;