import Booking from '../models/booking.model.js';
import Slot from '../models/slots.model.js';

export const createBooking = async (req, res) => {
    const { slotId } = req.body; 
    
    if (!slotId) {
        return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Slot ID is required' } });
    }

    try {
        const slotExists = await Slot.findById(slotId);
        if (!slotExists) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'The selected slot does not exist.' } });
        }

        const newBooking = new Booking({
            userId: req.user.id,
            slotId,
        });

        await newBooking.save();
        return res.status(201).json(newBooking);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: {
                    code: 'SLOT_TAKEN',
                    message: 'This appointment slot is no longer available.'
                }
            });
        }
        return res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('slotId', 'start_at end_at')
            .sort({ 'slotId.start_at': 'asc' });
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('userId', 'name email')
            .populate('slotId', 'start_at end_at')
            .sort({ 'slotId.start_at': 'asc' });
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};