const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST")

//Route
router.get("/allposts", requireLogin, (req,res)=>{
    POST.find()
    .populate("postedBy","_id name Photo")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
        .then(posts=>res.json(posts))
        .catch(err => console.log(err))
})

router.post("/createPost",requireLogin,(req,res)=>{
    const {body,pic}= req.body;
    if(!body || !pic){
        return res.status(422).json({error:"Please add all the fields"})
    }
    console.log(req.user)
    const post = new POST({
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then((result)=>{
        return res.json({post:result})
    }).catch(err=> console.log(err))
})

router.get("/myposts",requireLogin, (req,res)=>{
    POST.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then(myposts => {
        res.json(myposts)
    })
})

router.put("/like", requireLogin, async (req, res) => {
    try {
      const result = await POST.findByIdAndUpdate(
        req.body.postId,
        { $push: { likes: req.user._id } },
        { new: true }
      ).populate("postedBy", "_id name Photo")

      .exec();
  
      if (!result) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      res.json(result);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
  });

router.put("/unlike", requireLogin, async (req, res) => {
  try {
    const result = await POST.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).populate("postedBy", "_id name Photo")

    .exec();

    if (!result) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(result);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});

router.put("/comment", requireLogin, async (req, res) => {
  try {
    const comment = {
      comment: req.body.text,
      postedBy: req.user._id,
    };

    const result = await POST.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name Photo");

    if (!result) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(result);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});

//API to delete post
router.delete("/deletePost/:postId", requireLogin, (req, res) => {
  POST.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec()
    .then((post) => {
      if (!post) {
        return res.status(422).json({ error: "Post not found" });
      }

      if (post.postedBy._id.toString() == req.user._id.toString()) {
        return post.deleteOne() // Use deleteOne() to delete the document
          .then(() => {
            return res.json({ message: "Successfully deleted" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    });
});

//to show following post
router.get("/myfollowingpost",requireLogin, (req,res)=>{
    POST.find({postedBy:{$in:req.user.following}})
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts=>{
      res.json(posts)
    })
    .catch(err=>{console.log(err)})
})


module.exports = router