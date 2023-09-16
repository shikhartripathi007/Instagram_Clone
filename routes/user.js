const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");


//to get user profile
router.get("/user/:id", async (req, res) => {
    try {
      const user = await USER.findOne({ _id: req.params.id }).select("-password");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const posts = await POST.find({ postedBy: req.params.id }).populate("postedBy", "_id");
  
      res.status(200).json({ user, posts });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  });
  

  //to follow user
  router.put("/follow", requireLogin, async (req, res) => {
    try {
      // Update the follower list of the user being followed
      const updatedUser = await USER.findByIdAndUpdate(
        req.body.followId,
        {
          $push: { followers: req.user._id },
        },
        { new: true }
      );
  
      // Update the following list of the current user
      const currentUser = await USER.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      );
  
      res.json({ updatedUser, currentUser });
    } catch (err) {
      console.error(err);
      return res.status(422).json({ error: err.message });
    }
  });
  

    //to unfollow user
    router.put("/unfollow", requireLogin, async (req, res) => {
      try {
        // Remove the user from the follower list of the user being unfollowed
        const updatedUser = await USER.findByIdAndUpdate(
          req.body.followId,
          {
            $pull: { followers: req.user._id },
          },
          { new: true }
        );
    
        // Remove the user from the following list of the current user
        const currentUser = await USER.findByIdAndUpdate(
          req.user._id,
          {
            $pull: { following: req.body.followId },
          },
          { new: true }
        );
    
        res.json({ updatedUser, currentUser });
      } catch (err) {
        console.error(err);
        return res.status(422).json({ error: err.message });
      }
    });
    

    //to upload profile pic
    router.put("/uploadProfilePic", requireLogin, async (req, res) => {
      try {
        const result = await USER.findByIdAndUpdate(
          req.user._id,
          { $set: { Photo: req.body.pic } },
          { new: true }
        );
    
        res.json(result);
      } catch (err) {
        res.status(422).json({ error: err.message });
      }
    });
    


module.exports = router;