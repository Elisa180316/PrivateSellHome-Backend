const express = require ('express')
const mongoose = require ('mongoose')
const dotenv = require ('dotenv').config()
const cors = require('cors')
const app = express()
const authRoute = require ('./routes/authRoute')
const propertyRoute = require ('./routes/propertyRoute')
const uploadRoute = require ('./routes/uploadRoute')

//Routes e middlewares//
app.use(cors())
app.use (express.json())
app.use(express.urlencoded({extended: true}))
app.use ('/auth', authRoute)
app.use ('/property', propertyRoute)
app.use ('/upload', uploadRoute)
app.use ('/images', express.static('public/images'))
app.use('/property/find', propertyRoute);
app.use('/property/find/:id', propertyRoute)





mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = mongoose.connection;
  
  db.on('error', console.error.bind(console, 'Connection error to MongoDB'));
  db.once('open', () => {
    console.log('MongoDB has been started sucessfully');
  });

app.listen(process.env.PORT, () => console.log('Server has been started successfully'))

