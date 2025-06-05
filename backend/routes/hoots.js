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


module.exports = router;