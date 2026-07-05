// routes/bookingRoutes.js
// All booking routes - protected (login required)

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All routes below need login (protect middleware runs first)
router.get('/',              protect, controller.getAllBookings);   // Read all
router.get('/create',        protect, controller.getCreate);       // Show create form
router.post('/create',       protect, controller.postCreate);      // Create booking
router.get('/edit/:id',      protect, controller.getEdit);         // Show edit form
router.post('/edit/:id',     protect, controller.postEdit);        // Update booking
router.get('/delete/:id',    protect, controller.deleteBooking);   // Delete booking

module.exports = router;
