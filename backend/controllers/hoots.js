// Define routes and export them as controllers and hook up in routes folder.
const Hoot = require('../models/hoot');

module.exports = {
  index,
  create,
  show,
  update,
  delete: deleteHoot,
  addComment,
  updateComment,
  deleteComment,
};

async function index(req, res) {
  try {
    const hoots = await Hoot.find({}).populate('author', 'name');
    // Below would return all posts for just the logged in user
    // const posts = await Post.find({author: req.user._id});
    res.json(hoots);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to Fetch Hoots' });
  }
}

async function create(req, res) {
  try {
    req.body.author = req.user._id;
    const hoot = await Hoot.create(req.body);
    hoot._doc.author = req.user;
    res.status(201).json(hoot);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to Create Hoot' });
  }
}

async function show(req, res) {
  try {
    // populate author of hoot and comments
    const hoot = await Hoot.findById(req.params.hootId).populate([
      "author",
      "comments.author",
    ]);
    res.status(200).json(hoot);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to Find That Hoot' });
  }
}

async function update(req, res) {
  try {
    // Find the hoot:
    const hoot = await Hoot.findById(req.params.hootId);
    
    // Check permissions:
    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    // Update hoot:
    const updatedHoot = await Hoot.findByIdAndUpdate(req.params.hootId, req.body, { new: true });
    // Append req.user to the author property:
    updatedHoot._doc.author = req.user;

    res.status(200).json(updatedHoot);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to Update Hoot' });
  }
}

async function deleteHoot(req, res) {
  try {
    const hoot = await Hoot.findById(req.params.hootId);
    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId);
    res.status(200).json(deletedHoot);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to Delete Hoot' });
  }
}

// Comment Functions Below

async function addComment(req, res) {
  try {
    req.body.author = req.user._id;
    const hoot = await Hoot.findById(req.params.hootId);
    hoot.comments.push(req.body);
    await hoot.save();

    // Find the newly created comment:
    const newComment = hoot.comments[hoot.comments.length - 1];
    newComment._doc.author = req.user;
    // Respond with the newComment:
    res.status(201).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to Create Comment' });
  }
}

async function updateComment(req, res) {
  try {
    req.body.author = req.user._id;
    const hoot = await Hoot.findById(req.params.hootId);
    const comment = hoot.comments.id(req.params.commentId);
    // ensures the current user is the author of the comment
    if (comment.author.toString() !== req.user._id) {
      return res.status(403).json({ message: "You are not authorized to edit this comment" });
    }

    comment.text = req.body.text;
    await hoot.save();
    res.status(200).json({ message: "Comment Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to Update Comment' });
  }
}

async function deleteComment(req, res) {
  try {
    const hoot = await Hoot.findById(req.params.hootId);
    const comment = hoot.comments.id(req.params.commentId);
    
    if (comment.author.toString() !== req.user._id) {
      return res.status(403).json({ message: "You are not authorized to edit this comment" });
    }

    hoot.comments.remove({ _id: req.params.commentId });
    await hoot.save();
    res.status(200).json({ message: "Comment Deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to Delete Comment' });
  }
}