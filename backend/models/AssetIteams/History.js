const mongoose = require("mongoose");
const HistorySchema = new mongoose.Schema({
    updatedHistory: {
        type: Object,
        required: true,
    },
   
},
{ timestamps: true }
)

module.exports = mongoose.model('History', HistorySchema)