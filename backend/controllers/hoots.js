// Define routes and export them as controllers and hook up in routes folder.
const Hoot = require('../models/hoot');

module.exports = {
  index,
  create,
  show,
  update,
};

async function index(req, res) {
  try {
    const hoots = await Hoot.find({});
    // Below would return all posts for just the logged in user
    // const posts = await Post.find({author: req.user._id});
    res.json(hoots);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch hoots' });
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
    res.status(400).json({ message: 'Failed to create hoot' });
  }
}

async function show(req, res) {
  try {
    const hoot = await Hoot.findById(req.params.hootId).populate("author");
    res.status(201).json(hoot);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to find that hoot' });
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

    res.status(201).json(updatedHoot);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to update hoot' });
  }
}
