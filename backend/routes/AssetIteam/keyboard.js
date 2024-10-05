const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Keyboard = require('../../models/AssetIteams/keyboard');
// const History = require('../../models/AssetItems/History');

// Post API to add a new Keyboard entry
router.post('/AddKeyboard', async (req, res) => {
  try {
    const { Keyboard_No, User_Name, Type, Status } = req.body;

    // Check if Keyboard_No already exists
    const existingKeyboard = await Keyboard.findOne({ Keyboard_No });
    if (existingKeyboard) {
      return res.status(400).json({ message: 'Keyboard_No already exists' });
    }

    const newKeyboard = new Keyboard({ Keyboard_No, User_Name, Type, Status });
    await newKeyboard.save();

    res.status(201).json({ message: 'New Keyboard added successfully', newKeyboard });
  } catch (error) {
    console.error("Error while adding Keyboard:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to fetch Keyboards
router.get('/GetKeyboard', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { Keyboard_No: { $regex: search, $options: 'i' } },
          { User_Name: { $regex: search, $options: 'i' } },
          { Type: { $regex: search, $options: 'i' } },
          { Status: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const keyboardData = await Keyboard.find(filter).lean().exec();
    const count = await Keyboard.countDocuments(filter);
    res.status(200).json({ message: 'Keyboard data fetched successfully', keyboardData, count });
  } catch (error) {
    console.error('Error while fetching Keyboard data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to count all Keyboards
router.get('/CountKeyboard', async (req, res) => {
  try {
    const count = await Keyboard.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching Keyboard count:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to count Keyboards by status
router.get('/CountStatus/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const statusCount = await Keyboard.countDocuments({ Status: status });
    res.status(200).json({ status, count: statusCount });
  } catch (error) {
    console.error('Error fetching status count:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update API
router.put('/UpdateKeyboard/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { User_Name, Type, Status } = req.body;

    // Find the document before update for history purposes
    const beforeUpdate = await Keyboard.findById(id);
    if (!beforeUpdate) {
      return res.status(404).json({ message: 'Keyboard not found' });
    }

    // Create a history record
    await History.create({ updatedHistory: beforeUpdate });

    // Update the Keyboard document
    const updatedKeyboard = await Keyboard.findByIdAndUpdate(
      id,
      { User_Name, Type, Status },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Keyboard updated successfully', updatedKeyboard });
  } catch (error) {
    console.error('Error while updating Keyboard:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
