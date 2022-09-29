require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const mongoString = process.env.DATABASE_URL;

const routes = require('./routes/routes');

mongoose.connect(mongoString);
const database = mongoose.connection;
// console.log(database.collection('vasilkova_store_db'));

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected!');
})

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/api', routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`)
});
