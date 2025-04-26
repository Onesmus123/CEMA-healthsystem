const mongoose = require('mongoose');

// Define Client schema
const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  programs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HealthProgram' }],
});

// Export Client model
module.exports = mongoose.model('Client', clientSchema);
