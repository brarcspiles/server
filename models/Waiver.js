const mongoose = require('mongoose');
const { Schema } = mongoose;

const WaiverSchema = new Schema({
  waiveremail: {
    type: String,
  }, 
  userId: {
    type: String,
  }, 
  companyname:{
    type: String,
  },
  jobsiteaddress:{
    type: String,
  },
  printname:{
    type: String,
  },
  waiversign:{
    type: String,
  },
  isAddSignature: { 
    type: Boolean, 
    default: false 
},
  status: { 
    type: String, 
    default: 'pending' 
},
  date:{
    type: String,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
}
});

module.exports = mongoose.model('waiver', WaiverSchema)