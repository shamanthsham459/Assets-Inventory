const mongoose = require("mongoose");
const empnameSchema = new mongoose.Schema({
    EmpName: {
        type: String,
        required: true
    }

},
{ timestamps: true }
)

module.exports = mongoose.model('empname', empnameSchema)