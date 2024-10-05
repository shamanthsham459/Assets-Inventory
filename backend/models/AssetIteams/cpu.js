const mongoose = require("mongoose");
const cpuSchema = new mongoose.Schema({
    CPU_NO: {
        type: String,
        required: true,
        unique: true,
    },
    User_Name: {
        type: String
    },
    Type:{
        type: String
    },
    OS:{
        type: String
    },
    RAM:{
        type: String
    },
    Storage:{
        type: String
    },
    Status:{
        type: String
    },


},
{ timestamps: true }
)

module.exports = mongoose.model('cpu', cpuSchema)