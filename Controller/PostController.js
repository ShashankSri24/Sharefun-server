import { Post } from "../model/PostSchema.js";
import { User } from "../model/SignUpSchema.js";
import { Comments } from "../model/CommentSchema.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
export const CreatePost = async (req, res, next) => {
  const { PostImg } = req.files;
  const Formats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (!Formats.includes(PostImg.mimetype)) {
    return next("File Format Not Supported!");
  }
  try {
    const userId = req.body.user._id;
    const { description } = req.body;
    console.log(description, PostImg);
    if (!description) {
      next("You must provide a description");
      return;
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
      PostImg.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next("Failed To Upload To Cloudinary");
    }
    // console.log(userId.toString(), description, cloudinaryResponse.secure_url);
    const post = await Post.create({
      userid: userId.toString(),
      description,
      PostImg: { url: cloudinaryResponse.secure_url },
    });

    res.status(200).json({
      sucess: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const GetPost = async (req, res, next) => {
  try {
    const { _id } = req.body.user;
    const user = await User.findById(_id);
    const friends = user.friends ?? [];

    const friendsPost = await Post.find({
      userId: { $in: friends },
    })
      .populate({
        path: "userid",
      })
      .sort({ _id: -1 });
    const otherPost = await Post.find({
      userId: { $nin: friends },
    })
      .populate({
        path: "userid",
      })
      .sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      message: "Post retreived Successfully",
      friendsPost,
      otherPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

export const userPost = async (req, res, next) => {
  try {
    const { _id } = req.params;
    
    const user = await User.findById({ d });
i
    const UserPosts = await Post.find({ user })
      .populate({
        path: "id",
        select: "firstName lastName location profileUrl",
      })
      .sort({ _id: -1 });
    if (!UserPosts) {
      return res.status(404).json({
        success: false,
        message: "No Post found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Post Retrieved Successfully",
      UserPosts : UserPosts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const { _id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(_id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
const index = post.likes.findIndex((pid)=> pid === String(userId))
    if(index===-1){
      post.likes.push(userId)
    }else{
    post.likes =   post.likes.filter((pid)=>pid !== String(userId))
    }
    const newPost = await Post.findByIdAndUpdate(_id , post,{
      new:true
    })
  await newPost.save()
    return res.status(200).json({
      success: true,
      message:'successfull',
      likes: post.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};
export const commentsOnPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId, comments } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post NOT Avaialble",
      });
    }
    const newComment = await Comment.create({
      postid: postId,
      userid: userId,
      comments,
    });

    post.comments.push(newComment._id);
    await post.save();
    return res.status(201).json({
      success: true,
      message: "Your Comments are added",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comments.findById({ postId })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .populate({
        path: "reply.userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });
    return res.status.json({
      success: true,
      message: "Successfull",
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userid } = req.body;

    const comment = await Comments.findById(commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    if (comment.likes.includes(userid)) {
      return res
        .status(400)
        .json({ success: false, message: "You already liked this comment" });
    }
    comment.likes.push(userid);
    await comment.save();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};
export const replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, comments } = req.body;

    const comment = await Comments.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const newReply = await Comments.create({
      r_id: new mongoose.Types.ObjectId(),
      userid: userId,
      from: user.firstName,
      comments: comments,
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await comment.reply.post(newReply._id);
    await comment.save();
    return res.status(201).json({
      success: true,
      message: "Reply added successfully",
      reply: newReply,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};
export const likeOnReply = async (req, res) => {
  try {
    const { userId } = req.body;
    const { commentId, replyId } = req.params;
    const comment = await Comments.findById(commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    const reply = comment.reply.id(replyId);
    if (!reply) {
      return res
        .status(404)
        .json({ success: false, message: "Reply not found" });
    }
    if (reply.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You already liked this reply",
      });
    }
    reply.likes.push(userId);
    comment.markModified("reply")();
    return res.status(200).json({
      success: true,
      message: "Reply liked successfully",
      likes: reply.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};


export const deletePost = async (req, res, next) => {
  try {
    const { _id } = req.params;
    console.log(_id)
    // console.log("Request body: ", req.body);

    // // Validate ObjectId
    // if (!mongoose.Types.ObjectId.isValid(_id)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid Post ID",
    //   });
    // }

    const post = await Post.findById(_id);
    // console.log("Post found: ", post);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "No Post found",
      });
    }

    await Post.findByIdAndDelete(_id);
    
    return res.status(200).json({
      success: true,
      message: "Post has been deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};


