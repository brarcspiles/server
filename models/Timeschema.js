const mongoose = require('mongoose');
const {Schema} = mongoose;

const TimeSchema = new Schema({
    
    userid:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    isteamMember:{
        type: Boolean,
        required: true
    },
    startTime: { type: String },
    endTime: { type: String },
    
    
  timeInSeconds: { type: String },
  totalTime: Object, 
});

module.exports = mongoose.model('timeschema',TimeSchema)