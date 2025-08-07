import {Router} from 'express';

import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { createBooking, getMyBookings, getAllBookings } from '../controllers/booking.controller.js';
import { getAvailableSlots, createSlot, deleteSlot } from '../controllers/slots.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = Router();

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Public Slot Route
router.get('/slots', getAvailableSlots);

// Protected Booking Routes
router.post('/book', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);

// Admin Routes
router.get('/all-bookings', protect, admin, getAllBookings);
router.post('/slots', protect, admin, createSlot); 
router.delete('/slots/:id', protect, admin, deleteSlot);

export default router;