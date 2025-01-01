import mongoose, { model, Schema } from "mongoose";

const CommentSchema = new mongoose.Schema({
    userid:{ type: Schema.Types.ObjectId , ref :"User"},
    postid:{type: Schema.Types.ObjectId , ref :"Post"},
    comments:{
        type:String,
        maxLength:[1000,"maximum length  1000 words"]
    },
    
    reply:[{
        r_id:{type: Schema.Types.ObjectId},
        userid:{type: Schema.Types.ObjectId , ref:"User"},
        from:{type:String},
        replyAt:{type:String},
        comments:{type:String},
        likes : [{type: String}],
        createdAt:{type:Date , default:Date.now()},
        updatedAt:{type:Date , default:Date.now()}
    }]
})

export const Comments = mongoose.model("comments",CommentSchema)