const express = require('express');
const router = express.Router();
const HealthProgram = require('../models/HealthProgram');

// Create a health program
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  try {
    const newProgram = new HealthProgram({ name, description });
    await newProgram.save();
    res.status(201).json(newProgram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all health programs
router.get('/', async (req, res) => {
  try {
    const programs = await HealthProgram.find();
    res.json(programs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
