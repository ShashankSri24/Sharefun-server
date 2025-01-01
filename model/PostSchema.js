import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema({
  userid: { type: Schema.Types.ObjectId, ref: "User" },
  description: {
    type: String,
    maxLength: [1000, "maximum length  1000 words"],
  },
  PostImg: {
    url: String,
  },
  likes: [{ type: String }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Post = mongoose.model("Post", PostSchema);
