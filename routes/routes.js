const aws = require("aws-sdk");
const express = require('express');

require('dotenv').config();

const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');

const router = express.Router();
const Model = require('../models/model');
const Order = require('../models/order')

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-west-2"
});

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './uploads/');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.originalname);
//   }
// });

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, '')
  }
})

const upload = multer({ storage: storage });

const uploadImg = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: process.env.S3_BUCKET_NAME,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname);
    }
  })
})

const s3Upload = async (files) => {
  const s3 = new aws.S3();

  const params = files.map(file => {
    return {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploads/${file.originalname}`,
      Body: file.buffer,
      acl: 'public-read-write'
    }
  });

  const results = await Promise.all(
    params.map((param) => s3.upload(param).promise())
  );

  return results;
}

module.exports = router;

// Post Method
router.post('/post', cors(), upload.array('images', 30), async (request, response) => {
  console.log(request.body, request.files);

  const results = await s3Upload(request.files);

  const product = new Model({
    productId: request.body.productId,
    name: request.body.name,
    brand: request.body.brand,
    category: request.body.category,
    productType: request.body.productType,
    inStock: JSON.parse(request.body.inStock),
    onSale: request.body.onSale,
    description: request.body.description,
    price: request.body.price,
    color: request.body.color,
    keywords: request.body.keywords.split(", "),
    images: request.files.map(file => file.originalname)
  });

  try {
    const dataToSave = product.save(); // saves an entry if it is entered precisely according to the created model
    response.status(200).json(dataToSave);
  } catch (error) {
    response.status(400).json({
      message: error.message
    })
  }
})

// Get All Method
router.get('/getAll', cors(), async (request, response) => {
  try {
    const data = await Model.find(); // returns all the data from the database
    response.json(data)
  } catch (error) {
    response.status(500).json({
      message: error.message
    })
  }
})

// Get by ID Method
router.get('/getOne/:id', cors(), async (request, response) => {
  try {
    const data = await Model.findById(request.params.id); // returns an entry corresponding to the specified id parameter
    response.json(data)
  } catch (error) {
    response.status(500).json({
      message: error.message
    })
  }
})

// Update by ID Method
router.patch('/update/:id', cors(), async (request, response) => {
  try {
    const id = request.params.id; // the id of the object to update
    const updatedData = request.body; // the data itself
    const options = { new: true }; // specifies whether to return the updated data in the body or not

    const result = await Model.findByIdAndUpdate(
      id, updatedData, options
    )

    response.send(result)
  } catch (error) {
    response.status(400).json({ message: error.message })
  }
})

// Delete by ID Method
router.delete('/delete/:id', cors(), async (request, response) => {
  try {
    const id = request.params.id; // the id of the entry to delete
    const data = await Model.findByIdAndDelete(id);
    response.send(`Entry with product ID ${data.productId} has been deleted`)
  } catch (error) {
    response.status(400).json({ message: error.message })
  }
})

// Delete All Method
// router.delete('/delete', cors(), async (request, response) => {
//   try {
//     const data = await Model.deleteMany();
//     fse.emptyDir('./uploads', error => {
//       if (error) {
//         return console.error(error);
//       }

//       console.log('Uploads cleared!');
//     });

//     response.send('All data removed from database')
//   } catch (error) {
//     response.status(400).json({ message: error.message })
//   }
// })

router.post('/createOrder', cors(), async (request, response) => {
  console.log(request.body);
  const data = new Order({
    orderId: request.body.orderId,
    orderDate: request.body.orderDate,
    productsDetails: request.body.productsDetails,
    subtotal: request.body.subtotal,
    customerInfo: request.body.customerInfo,
    status: request.body.status
  })

  try {
    const dataToSave = await data.save(); // saves an entry if it is entered precisely according to the created model
    response.status(200).json(dataToSave);
  } catch (error) {
    response.status(400).json({
      message: error.message
    })
  }
})

router.get('/getAllOrders', cors(), async (request, response) => {
  try {
    const data = await Order.find(); // returns all the data from the database
    response.json(data)
  } catch (error) {
    response.status(500).json({
      message: error.message
    })
  }
})

router.get('/getOneOrder/:id', cors(), async (request, response) => {
  try {
    const data = await Order.findById(request.params.id); // returns an entry corresponding to the specified id parameter
    response.json(data)
  } catch (error) {
    response.status(500).json({
      message: error.message
    })
  }
})

router.patch('/updateOrder/:id', cors(), async (request, response) => {
  try {
    const id = request.params.id; // the id of the object to update
    const updatedData = request.body; // the data itself
    const options = { new: true }; // specifies whether to return the updated data in the body or not

    const result = await Order.findByIdAndUpdate(
      id, updatedData, options
    )

    response.send(result)
  } catch (error) {
    response.status(400).json({ message: error.message })
  }
})

router.delete('/deleteOrder/:id', cors(), async (request, response) => {
  try {
    const id = request.params.id; // the id of the entry to delete
    const data = await Order.findByIdAndDelete(id);
    response.send(`Entry with order ID ${data.orderId} has been deleted`)
  } catch (error) {
    response.status(400).json({ message: error.message })
  }
})
