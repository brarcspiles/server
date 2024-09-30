const mongoose = require('mongoose');

// Schema for Canadian Screw Piles
const CanadianScrewPilesSchema = new mongoose.Schema({
  quantity: { type: String, required: true },
  model: { type: String, required: true },
  averageDepth: { type: String, required: true },
  outsideDiameter: { type: String, required: true },
  wallThickness: { type: String, required: true },
  helixDiameter: { type: String, required: true }
});

// Schema for Bearing Capacity
const BearingCapacitySchema = new mongoose.Schema({
  modelP: { type: String, required: true },
  load: { type: String, required: true },
  compression: { type: String, required: true }
});

// Main Conformity Report Schema
const ConformityReportSchema = new mongoose.Schema({
  clientAddress: { type: String, required: true }, // Client Address Field
  file: { type: String, required: true }, // Client Address Field
  project: { type: String, required: true }, // Client Address Field
  date: { type: String, required: true }, // Client Address Field
  canadianScrewPiles: [CanadianScrewPilesSchema],  // Array of Canadian Screw Piles sections
  bearingCapacity: [BearingCapacitySchema],        // Array of Bearing Capacity sections
  createdAt: { type: Date, default: Date.now }     // Timestamp for when the report was created
});

// Export the model
module.exports = mongoose.model('ConformityReport', ConformityReportSchema);
