import Slot from '../models/slots.model.js';
import Booking from '../models/booking.model.js';

export const getAvailableSlots = async (req, res) => {
    const { from, to } = req.query;
    if (!from || !to) {
        return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Missing from/to date query parameters.' } });
    }

    try {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        const bookings = await Booking.find({});
        const bookedSlotIds = bookings.map(booking => booking.slotId);

        const availableSlots = await Slot.find({
            _id: { $nin: bookedSlotIds },
            start_at: {
                $gte: fromDate,
                $lte: new Date(toDate.getTime() + (24 * 60 * 60 * 1000)),
            },
        }).sort({ start_at: 'asc' });

        return res.status(200).json(availableSlots);
    } catch (error) {
        return res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

export const createSlot = async (req, res) => {
    const { start_at, end_at } = req.body;
    if (!start_at || !end_at) {
        return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'start_at and end_at are required' } });
    }
    try {
        const slot = await Slot.create({ start_at, end_at });
        return res.status(201).json(slot);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: { code: 'SLOT_EXISTS', message: 'This slot already exists.' } });
        }
        return res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

export const deleteSlot = async (req, res) => {
    try {
        const slotId = req.params.id;

        const existingBooking = await Booking.findOne({ slotId: slotId });
        if (existingBooking) {
            return res.status(400).json({ error: { code: 'SLOT_BOOKED', message: 'Cannot delete a slot that is already booked.' } });
        }

        const slot = await Slot.findByIdAndDelete(slotId);
        if (!slot) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Slot not found' } });
        }

        return res.status(200).json({ message: 'Slot deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};