const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Invoice = require('./models/Invoice');
const Item = require('./models/Item');
const InvoiceData = require('./models/InvoiceData');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect('mongodb+srv://yrohan645:yoHHVZ82lZkG4Kt3@rohan.zysfuhl.mongodb.net/New?retryWrites=true&w=majority&appName=Rohan')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));




// 📄 Get all invoices
app.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices); // This returns JSON at "/"
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});



// 🔍 Search invoices by customer name
app.get('/invoices/search', async (req, res) => {
  const { customerName } = req.query;

  try {
    const invoices = await Invoice.find({
      customerName: { $regex: new RegExp(customerName, 'i') },
    });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ➕ Create a new invoice
app.post('/invoices', async (req, res) => {
  try {
    const newInvoice = new Invoice(req.body);
    await newInvoice.save();
    res.status(201).json({ message: 'Invoice saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 📦 Get all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ➕ Add new item
app.post('/items', async (req, res) => {
  const { productName, sellingPrice, gstValue, unit, hsn } = req.body;

  if (!productName || !sellingPrice || !gstValue || !unit || !hsn) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newItem = new Item({ productName, sellingPrice, gstValue, unit, hsn });
    await newItem.save();
    res.status(201).json({ message: '✅ Item added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ➕ Save invoice data
app.post('/invoices/submit', async (req, res) => {
  try {
    const newInvoiceData = new InvoiceData(req.body);
    await newInvoiceData.save();
    res.status(200).json({ message: 'Invoice data saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
