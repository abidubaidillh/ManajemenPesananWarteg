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
app.put('/orders/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
});

// DELETE hapus pesanan
app.delete('/orders/:id', async (req, res) => {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.json({ message: "Order deleted" });
});

// Server start
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
