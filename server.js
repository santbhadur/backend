const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Invoice = require('./models/Invoice');
const Item = require('./models/Item');
const InvoiceData = require('./models/InvoiceData');
const SaleData = require('./models/SaleData');

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
    res.json(invoices);
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

// 📥 Save invoice to both InvoiceData and SaleData
let currentInvoiceNumber = 1;

// 📤 Get next invoice number
app.get('/api/next-invoice-number', async (req, res) => {
  try {
    const lastInvoice = await SaleData.findOne().sort({ invoiceNumber: -1 });
    const nextInvoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : currentInvoiceNumber;
    res.json({ invoiceNumber: nextInvoiceNumber });
  } catch (err) {
    console.error('Error fetching next invoice number:', err);
    res.status(500).json({ message: 'Server error getting invoice number' });
  }
});

app.post('/invoices/submit', async (req, res) => {
  console.log("Received invoice submission:", req.body);

  const {
    invoiceNumber,
    customerId,
    customerName,
    customerAddress,
    invoiceDate,
    dueDate,
    notes,
    items,
    totalProducts,
    totalQuantity,
    grandTotal,
    someField
  } = req.body;

  // ✅ Basic validation
  if (!customerName || !items || items.length === 0 || !someField) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    // ✅ Create and save InvoiceData
    const invoiceData = new InvoiceData({
      invoiceNumber,
      customerId,
      customerName,
      customerAddress,
      invoiceDate,
      dueDate,
      notes,
      items,
      totalProducts,
      totalQuantity,
      grandTotal,
      someField
    });

    await invoiceData.save();

    // ✅ Create and save SaleData (can be the same or similar structure)
    const saleData = new SaleData({
      invoiceNumber,
      customerId,
      customerName,
      customerAddress,
      invoiceDate,
      dueDate,
      notes,
      items,
      totalProducts,
      totalQuantity,
      grandTotal,
      someField
    });

    await saleData.save();

    currentInvoiceNumber += 1;

    res.status(201).json({ message: 'Invoice saved successfully', invoiceNumber });
  } catch (error) {
    console.error('❌ Error saving invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// 📄 Get all sales invoices (newest first)
app.get('/sales', async (req, res) => {
  try {
    const sales = await SaleData.find().sort({ invoiceDate: -1 });
    res.json(sales);
  } catch (err) {
    console.error('Error fetching sales:', err);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
});

// ❌ DELETE Sale by ID
app.delete('/sales/:id', async (req, res) => {
  try {
    const deleted = await SaleData.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ error: 'Failed to delete sale' });
  }
});

// 📄 GET Sale by ID (for detail view)
app.get('/sales/:id', async (req, res) => {
  try {
    const sale = await SaleData.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
