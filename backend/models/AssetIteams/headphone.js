const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HeadphoneSchema = new Schema({
  Headphone_No: { type: String, required: true, unique: true },
  User_Name: { type: String },
  Type: { type: String },
  Status: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Headphone', HeadphoneSchema);