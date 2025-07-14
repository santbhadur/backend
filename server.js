const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Get all invoices
app.get('/', (req, res) => {
  const query = 'SELECT * FROM invoices';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching invoices:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});
app.get('/invoices', (req, res) => {
  const query = 'SELECT * FROM invoices';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching invoices:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

// Search invoices by customer name
app.get('/invoices/search', (req, res) => {
  const customerName = req.query.customerName;

  const query = 'SELECT * FROM invoices WHERE LOWER(customerName) LIKE LOWER(?)';
  const values = [`%${customerName}%`];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error searching invoices:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

// Create a new invoice
app.post('/invoices', (req, res) => {
  const { customerName, phoneNumber, address } = req.body;

  const query = 'INSERT INTO invoices (customerName, phoneNumber, address) VALUES (?, ?, ?)';
  const values = [customerName, phoneNumber, address];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error inserting data:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({ message: 'Invoice saved successfully' });
  });
});
// GET /items - Retrieve all items from the database
app.get('/items', (req, res) => {
  const query = 'SELECT * FROM items';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching items:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json(results);
  });
});

// POST /items - Add new item to the database
app.post('/items', (req, res) => {
  const { productName, sellingPrice, gstValue, unit, hsn } = req.body;

  if (!productName || !sellingPrice || !gstValue || !unit || !hsn) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO items (productName, sellingPrice, gstValue, unit, hsn) VALUES (?, ?, ?, ?, ?)';
  const values = [productName, sellingPrice, gstValue, unit, hsn];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error inserting item:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({ message: '✅ Item added successfully' });
  });
});


// Example POST route on the server
app.post('/invoices/submit', (req, res) => {
    const { invoiceId, selectedOption1, selectedOption2, inputText } = req.body;
  
    const query = 'INSERT INTO invoice_data (invoiceId, selectedOption1, selectedOption2, inputText) VALUES (?, ?, ?, ?)';
    const values = [invoiceId, selectedOption1, selectedOption2, inputText];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error saving invoice data:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      res.status(200).json({ message: 'Invoice data saved successfully' });
    });
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
