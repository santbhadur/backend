const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  address1: String,
  address2: String,
  pincode: String,
  city: String,
  state: String,
});

const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  gstNumber: String,
  companyName: String,
  billingAddress: addressSchema,
  shippingAddress: addressSchema,
});

module.exports = mongoose.model('Customer', customerSchema);
