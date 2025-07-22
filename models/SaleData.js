const mongoose = require('mongoose');

const SaleItemSchema = new mongoose.Schema({
  id: String,
  productName: String,
  quantity: Number,
  unitPrice: String,
  priceWithTax: String,
  discount: Number,
  total: String,
});

const SaleDataSchema = new mongoose.Schema({
  invoiceNumber: { type: Number, required: true },
  customerId: String,
  customerName: String,
  customerAddress: String,
  invoiceDate: String,
  dueDate: String,
  notes: String,
  items: [SaleItemSchema],
  totalProducts: Number,
  totalQuantity: Number,
  grandTotal: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SaleData', SaleDataSchema);
