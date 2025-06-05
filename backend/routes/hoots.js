// Everything the lesson requires for controllers we put here instead.
const express = require('express');
const router = express.Router();
const hootsCtrl = require('../controllers/hoots');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/hoots'

// Protect all defined routes
router.use(ensureLoggedIn);

// GET /api/hoots (INDEX action)
router.get('/', hootsCtrl.index);
// POST /api/hoots (CREATE action)
router.post('/', hootsCtrl.create);
// GET /api/hoots/:hootId (SHOW action)
router.get('/:hootId', hootsCtrl.show);
// PUT /api/hoots/:hootId (UPDATE action)
router.put('/:hootId', hootsCtrl.update);
// DELETE /api/hoots/:hootId (DELETE action)
router.delete('/:hootId', hootsCtrl.delete);

// Comment Routes Below

// POST /api/hoots/:hootId/comments (CREATE action)
router.post('/:hootId/comments', hootsCtrl.addComment);
// PUT /api/hoots/:hootId/comments/:commentId (UPDATE action)
router.put('/:hootId/comments/:commentId', hootsCtrl.updateComment);
// DELETE /api/hoots/:hootId/comments/:commentId (DELETE action)
router.delete('/:hootId/comments/:commentId', hootsCtrl.deleteComment);


module.exports = router;