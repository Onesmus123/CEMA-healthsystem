const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const HealthProgram = require('../models/HealthProgram');

// Register a new client
router.post('/', async (req, res) => {
  const { name, age, email, programIds } = req.body;

  try {
    // Find all programs by their IDs
    const programs = await HealthProgram.find({ '_id': { $in: programIds } });

    // Create a new client with the associated programs
    const newClient = new Client({ name, age, email, programs });

    // Save client to database
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get client by email
router.get('/:email', async (req, res) => {
  const { email } = req.params;
  try {
    // Find client and populate program details
    const client = await Client.findOne({ email }).populate('programs');
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Enroll a client in additional health programs
router.put('/:email/enroll', async (req, res) => {
  const { email } = req.params;
  const { programIds } = req.body;

  try {
    // Find the client by email
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Find programs to enroll the client into
    const programs = await HealthProgram.find({ '_id': { $in: programIds } });

    // Add programs to client's enrolled programs
    client.programs.push(...programs);
    await client.save();

    res.json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
