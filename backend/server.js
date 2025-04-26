const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();  // Load environment variables from .env file

const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Connect to MongoDB using the connection URI from .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));


// Define MongoDB models (schemas)

// Health Program Schema
const healthProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const HealthProgram = mongoose.model('HealthProgram', healthProgramSchema);

// Client Schema
const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  programs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HealthProgram' }],
});

const Client = mongoose.model('Client', clientSchema);

// Create a new health program
app.post('/api/programs', async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required' });
  }

  try {
    const newProgram = new HealthProgram({ name, description });
    await newProgram.save();
    res.status(201).json({
      message: 'Health program created successfully',
      program: newProgram,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating health program', error: err.message });
  }
});

// Register a new client
app.post('/api/clients', async (req, res) => {
  const { name, age, programs } = req.body;

  if (!name || !age || !programs || !Array.isArray(programs) || programs.length === 0) {
    return res.status(400).json({ message: 'Name, age, and at least one program are required' });
  }

  try {
    // Fetch programs by their IDs from the database
    const programDocs = await HealthProgram.find({ _id: { $in: programs } });

    if (programDocs.length !== programs.length) {
      return res.status(400).json({ message: 'One or more programs not found' });
    }

    const newClient = new Client({
      name,
      age,
      programs: programDocs.map(program => program._id),
    });

    await newClient.save();

    res.status(201).json({
      message: 'Client registered successfully',
      client: newClient,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering client', error: err.message });
  }
});

// Enroll a client in one or more programs
app.put('/api/clients/:clientId/enroll', async (req, res) => {
  const { clientId } = req.params;
  const { programs } = req.body;

  if (!programs || !Array.isArray(programs) || programs.length === 0) {
    return res.status(400).json({ message: 'At least one program is required' });
  }

  try {
    // Fetch the programs by their IDs
    const programDocs = await HealthProgram.find({ _id: { $in: programs } });

    if (programDocs.length !== programs.length) {
      return res.status(400).json({ message: 'One or more programs not found' });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { $addToSet: { programs: { $each: programDocs.map(p => p._id) } } },
      { new: true }
    ).populate('programs');

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({
      message: 'Client enrolled in programs successfully',
      client: updatedClient,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error enrolling client in programs', error: err.message });
  }
});

// Search for a client by name
app.get('/api/clients/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const client = await Client.findOne({ name })
      .populate('programs')  // Populate programs field with program details
      .exec();

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ client });
  } catch (err) {
    res.status(500).json({ message: 'Error searching for client', error: err.message });
  }
});

// Client profile endpoint (view client profile with enrolled programs)
app.get('/api/clients/:clientId/profile', async (req, res) => {
  const { clientId } = req.params;

  try {
    const client = await Client.findById(clientId)
      .populate('programs')
      .exec();

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ client });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching client profile', error: err.message });
  }
});

// Start the server on the specified port (5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
