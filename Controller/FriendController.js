import { Friend } from "../model/FriendReqSchema.js";
import { User } from "../model/SignUpSchema.js";


export const FriendRequest = async (req,res,next)=>{
     try{
        const {userid} = req.body.user;  //user 1
        const {RequestTo} = req.body;   //user 2
     const RequestExit = await Friend.findOne({
        RequestFrom : userid,
        RequestTo : RequestTo
     }
        
     )
     if(RequestExit){
        return res.json({
            status:404,
            message:"Request has already  been sent"
        })
    }
    const accountexits = await Friend.findOne({
        requestform: RequestTo, // u2
        RequestTo: userid //u1
    })
    if(accountexits){
        next("User has already sent you a friend request. Please accept it.")
    }

    const newRequest = await Friend.findOne({
        requestform: userid, // sender of request
        RequestTo, // receiver of request
    })
    await newRequest.save();
    res.status(200). json({
        success:true,
        message:"Request has sent Successfully"
    })
     }catch(error){
        return 'something went wrong ' + error.message;
     }
}

export const GetFriendRequest = async (req,res,next)=>{

    try{
        const {userid} = req.body.user;

    const friendRequests = await Friend.find({
        RequestTo: userid,
        RequestStatus: 'pending'
      }).populate('RequestFrom', 'firstName', 'lastName');

      return res.status(200).json({ success: true, friendRequests }); 
    }
    
    
      catch (error) { console.error("Error fetching friend requests:", error); 
        return res.status(500).json({ success: false, message: 'Internal Server Error' }); }
      }

export const AcceptRequest = async (req,res,next)=>{
    const {requestId} = req.body;

    const Request = await Friend.findById(requestId)
    if(!Request){
        next('NO Frind Request is Found !')
    }
    Request.RequestStatus = 'Accepted'
    await Request.save();
    return res.status(200).send({
        success:true,
        message:'Request accepted Successfully ',
        
    })
}

export const ProfileViews = async (req,res,next)=> {
    try{
        const {userid} = req.body.user; //viewers
    const{id} = req.body; // profile 
    const user = await User.find(id)
    if (!user) { return res.status(404).json({ success: false, message: 'User not found' }); }
    user.views.push(userid)

    await user.save()
    return res.status(200).json(
        { success: true, 
        message: 'Profile view recorded successfully' 
    }

    );
    } 
catch (error) { console.error('Error adding view:', error); return res.status(500).json({ success: false, message: 'Internal Server Error'
})}
}

export const SuggestedFriends = async (req,res,next)=>{
   try{
    const {userid} = req.body.user;

    const friends = await User.find(userid).populate({path:'friends'})
    const userfriends = friends.map(friends => friends._id);

    const allUsers = await User.find({
        _id: { $ne: userid, $nin: userfriends }
      }).limit(15).populate('friends', ' firstName lastName profession');
      return res.status(200).json({
        success: true,
        allUsers
      });
   }catch(error){
    return res.status(404).json({
        success:false,
        message:'Suggestion failed'
    })
   }
        

   
}