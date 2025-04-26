const mongoose = require('mongoose');

// Define HealthProgram schema
const healthProgramSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

// Export HealthProgram model
module.exports = mongoose.model('HealthProgram', healthProgramSchema);
