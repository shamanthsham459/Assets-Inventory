const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// const conn = mongoose.connect('mongodb://192.168.1.20:27017/asset',{

// const conn = mongoose.connect('process.env.DB_URL',{
const conn = mongoose.connect('mongodb://127.0.0.1:27017/asset',{


})
  .then(() => {
    console.log('MongoDB Connection Succeeded true......');
  })
  .catch((err) => {
    console.log('Error in DB connection: ' + err);
  });
