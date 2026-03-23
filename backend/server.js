import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern_db';
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Schema and Model
const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Item = mongoose.model('item', ItemSchema);

// Routes
// @route   GET /api/items
// @desc    Get All Items
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ date: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/items
// @desc    Create An Item
app.post('/api/items', async (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });

    try {
        const item = await newItem.save();
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE /api/items/:id
// @desc    Delete An Item
app.delete('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await item.deleteOne();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
