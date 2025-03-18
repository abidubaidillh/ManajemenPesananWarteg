const express = require('express');
const mongoose = require('mongoose');
const Order = require('./models/order.model');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Koneksi MongoDB lokal
mongoose.connect('mongodb://127.0.0.1:27017/warungDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// --- ROUTES ---

// GET semua pesanan
app.get('/orders', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

// POST buat pesanan baru
app.post('/orders', async (req, res) => {
    const { customer_name, items, total_price } = req.body;
    if (!customer_name || !items || !total_price) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newOrder = new Order({
        customer_name,
        items,
        total_price,
        status: "pending"
    });

    await newOrder.save();
    res.status(201).json(newOrder);
});

// PUT update pesanan (contohnya update status/order)
// PUT khusus update status pesanan
// PUT update hanya status pesanan
app.put('/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validasi status
    if (!['pending', 'completed'].includes(status)) {
        return res.status(400).json({ message: "Status must be either 'pending' or 'completed'" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
});


// DELETE hapus pesanan
app.delete('/orders/:id', async (req, res) => {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
});


// Server start
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});