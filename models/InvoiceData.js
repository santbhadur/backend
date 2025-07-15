const mongoose = require('mongoose');

const invoiceDataSchema = new mongoose.Schema({
  invoiceId: String,
  selectedOption1: String,
  selectedOption2: String,
  inputText: String,
});

module.exports = mongoose.model('InvoiceData', invoiceDataSchema);
