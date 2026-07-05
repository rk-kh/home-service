// routes/pageRoutes.js
// Public pages (no login required)

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/pageController');

router.get('/',         controller.getHome);
router.get('/about',    controller.getAbout);
router.get('/services', controller.getServices);

module.exports = router;
