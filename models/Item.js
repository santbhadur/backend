const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productName: String,
  sellingPrice: Number,
  gstValue: Number,
  unit: String,
  hsn: String,
});

module.exports = mongoose.model('Item', itemSchema);
