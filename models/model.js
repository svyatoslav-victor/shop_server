const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  productId: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  brand: {
    required: true,
    type: String
  },
  category: {
    required: true,
    type: String
  },
  productType: { // pants, jackets, etc. See notebook notes
    required: true,
    type: String
  },
  inStock: {
    required: true,
    type: Boolean
  },
  onSale: {
    type: Boolean
  },
  isPopular: {
    type: Boolean
  },
  price: {
    required: true,
    type: Number
  },
  color: {
    required: true,
    type: String
  },
  description: {
    required: true,
    type: String
  },
  keywords: {
    required: true,
    type: [String]
  },
  images: {
    type: [String]
  }
})

module.exports = mongoose.model('Data', dataSchema);
