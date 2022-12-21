require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
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

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    password: process.env.PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  error
    ? console.log(error)
    : console.log(`Server is ready for emails: ${success}!`);
});

routes.post("/sendEmail", cors(), (request, response) => {
  let mailOptions = {
    from: process.env.EMAIL,
    to: `${request.body.email}, ${process.env.EMAIL}`,
    subject: `${request.body.subject}`,
    html: `${request.body.html}`,
  };
  
  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      console.log(`Error - ${error}`)
    } else {
      console.log("Email sent successfully!")
      response.json({ status: "Email sent!" })
    }
  })
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started at ${process.env.PORT || 5000}`)
});
