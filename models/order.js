const mongoose = require('mongoose');

const productsDetailsSchema = new mongoose.Schema({
  productId: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  price: {
    required: true,
    type: Number
  },
  color: {
    required: true,
    type: String
  },
  quantity: {
    required: true,
    type: Number
  },
  specs: {
    required: true,
    type: String
  },
  image: {
    type: String
  }
})

const orderSchema = new mongoose.Schema({
  orderId: {
    required: true,
    type: Number
  },
  productsDetails: {
    required: true,
    type: [productsDetailsSchema]
  },
  subtotal: {
    required: true,
    type: Number
  },
  customerInfo: {
    name: {
      required: true,
      type: String
    },
    phone: {
      required: true,
      type: String
    },
    email: {
      type: String
    }
  },
  status: {
    type: String
  }
})

module.exports = mongoose.model('Order', orderSchema);
