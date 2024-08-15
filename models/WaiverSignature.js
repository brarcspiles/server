const mongoose = require('mongoose');
const { Schema } = mongoose;

const WaiverSignatureSchema = new Schema({
    waiverId: {  
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'waiver' 
    },
    waiversign: { 
        type: String, 
        // required: true 
    }, 
    waiveremail: { 
        type: String, 
        required: true 
    },
    lastupdated: { 
        type: String,  
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('WaiverSignature', WaiverSignatureSchema);
