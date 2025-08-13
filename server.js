const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Invoice = require('./models/Invoice');
const Item = require('./models/Item');
const InvoiceData = require('./models/InvoiceData');
const SaleData = require('./models/SaleData');
const Customer = require('./models/Customer');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect('mongodb+srv://yrohan645:yoHHVZ82lZkG4Kt3@rohan.zysfuhl.mongodb.net/New?retryWrites=true&w=majority&appName=Rohan')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// 📄 Get all invoices
// Schema & Model
const formSchema = new mongoose.Schema({
  customerName: String,
  phoneNumber: String,
  price: Number,
  gst: Number,
  unit: String,
});

const FormModel = mongoose.model('FormSubmission', formSchema);

// POST route to save multiple entries
app.post('/save-all', async (req, res) => {
  try {
    const entries = req.body;
    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ error: 'No entries provided' });
    }
    await FormModel.insertMany(entries);
    res.status(200).json({ message: 'All entries saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Optional: GET route to view saved entries
app.get('/', async (req, res) => {
  try {
    const forms = await FormModel.find();
    res.status(200).json(forms);
  } catch (err) {
    console.error('❌ Error fetching form data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
app.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/invoices/submit/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (err) {
    console.error('Error fetching invoice by ID:', err);
    res.status(500).json({ message: 'Server error' });
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
let currentInvoiceNumber = 1014;

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
// server.js or routes/invoices.js

// 🔍 Get all submitted invoices (optional filtering can be added)
app.get('/api/invoices/submit', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ invoiceDate: -1 }); // latest first
    res.status(200).json(invoices);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
});


app.post('/api/invoices/submit', async (req, res) => {
  try {
    const invoiceData = req.body;

    if (!invoiceData || !invoiceData.items || invoiceData.items.length === 0) {
      return res.status(400).json({ message: 'Invoice data is missing or incomplete.' });
    }

    // ✅ Log full invoiceData for debugging
    console.log('📦 Invoice Received from Frontend:');
    console.log(JSON.stringify(invoiceData, null, 2));

    // ✅ Save to Invoice collection
    const newInvoice = new Invoice(invoiceData);
    const savedInvoice = await newInvoice.save();

    // ✅ Also save to SaleData collection if needed
    const newSaleData = new SaleData(invoiceData);
    const savedSale = await newSaleData.save();

    console.log('✅ Invoice and Sale saved successfully.');
    res.status(201).json({
      message: 'Invoice saved successfully!',
      invoice: savedInvoice,
      sale: savedSale,
    });

  } catch (error) {
    console.error('❌ Error saving invoice:', error);
    res.status(500).json({ message: 'Failed to save invoice.' });
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

app.delete('/api/invoices/submit/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice deleted successfully', deletedInvoice });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ message: 'Failed to delete invoice' });
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

app.get('/api/customers', async (req, res) => {
  try {
    const sales = await Customer.find()
    res.json(sales);
  } catch (err) {
    console.error('Error fetching sales:', err);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    console.error('Error saving customer:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/customers/search', async (req, res) => {
  const { customerName } = req.query;

  try {
    const invoices = await Customer.find({
      customerName: { $regex: new RegExp(customerName, 'i') },
    });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
