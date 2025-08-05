const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: Number,
  customerId: String,
  customerName: String,
  customerAddress: String,
  invoiceDate: String,
  dueDate: String,
  notes: String,

  items: [Object],
  totalProducts: Number,
  totalQuantity: Number,
  grandTotal: String,

  // GST / Discounts
  isIntraState: Boolean,
  cgst: String,
  sgst: String,
  igst: String,
  totalGstValue: String,
  avgGstPercent: String,
  avgDiscountPercent: String,
  totalDiscountValue: String,

}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
