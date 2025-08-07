import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
    start_at: {
        type: Date,
        required: true,
        unique: true,
    },
    end_at: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

slotSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
slotSchema.set('toJSON', {
    virtuals: true
});

const Slot = mongoose.model('Slot', slotSchema);
export default Slot;