const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  customerName: String,
  phoneNumber: String,
  address: String,
});

module.exports = mongoose.model('Invoice', invoiceSchema);
