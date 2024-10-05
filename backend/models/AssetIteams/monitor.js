// const mongoose = require("mongoose");
// const monitorSchema = new mongoose.Schema({
//     Monitor_NO: String(require, true),
//     User_Name: String,
//     Type: String,
//     Status: String,
// },
// { timestamps: true }
// )

// module.exports = mongoose.model('monitor', monitorSchema)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MonitorSchema = new Schema({
  Monitor_No: { type: String, required: true, unique: true },
  User_Name: { type: String },
  Type: { type: String },
  Status: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Monitor', MonitorSchema);
