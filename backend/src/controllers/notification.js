import { Notification } from "../models/notification.js";

const createNotification = async(req, res) => {
    const {title, message, recipent} = req.body;

    const isAdmin = req.user?.role === "Admin" || req.user?.role === "Teacher";
    if (!isAdmin) {
        // return res.status(401).json({ msg: "You are not authorized to send notifications!!"})
        throw new Error("You are not authorized to send notifications!")
    }

   try {
     const notification = await Notification.create({
         title,
         message,
         recipent: "all",
     })
 
     if(!notification){
         return res.status(401).json({msg: "Some error while creating notification!"})
     }
 
     return res.status(200).json({
         notification,
         msg: "Notification created Successfully!",
     })
   } catch (error) {
    console.log(error);
    return res.status(500).json({
        msg: "Server error occoured while creating notification!!"
    })
   } 
}

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().select("-toWhom -students").sort({ createdAt: -1 }); 
        if (!notifications) {
            return res.status(400).json({msg: "No notifications fetched!!"})
        }
        return res.status(200).json({
            msg: "Notifications retrieved successfullyy!!",
            notifications,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error while retrieving notifications" });
    }
};

export {
    createNotification,
    getNotifications,
}