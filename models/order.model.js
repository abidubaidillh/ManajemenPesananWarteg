const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer_name: { type: String, required: true },
    items: [{ type: String, required: true }],
    total_price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
