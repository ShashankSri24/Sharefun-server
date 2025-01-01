import mongoose, { Schema } from 'mongoose';
const FriendRequestSchema = new mongoose.Schema({
RequestTo:{type: Schema.Types.ObjectId , ref :" User"},
RequestFrom:{type: Schema.Types.ObjectId , ref :" User"},
RequestStatus:{type : String, enum:['pending', 'accepted', 'declined'], default: 'pending'}
})

export const Friend = mongoose.model("FriendSchema",FriendRequestSchema)