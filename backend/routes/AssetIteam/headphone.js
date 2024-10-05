const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Headphone = require('../../models/AssetItems/headphone');
const History = require('../../models/AssetItems/History');

// Post API to add a new Headphone entry
router.post('/AddHeadphone', async (req, res) => {
  try {
    const { Headphone_No, User_Name, Type, Status } = req.body;

    // Check if Headphone_No already exists
    const existingHeadphone = await Headphone.findOne({ Headphone_No });
    if (existingHeadphone) {
      return res.status(400).json({ message: 'Headphone_No already exists' });
    }

    const newHeadphone = new Headphone({ Headphone_No, User_Name, Type, Status });
    await newHeadphone.save();

    res.status(201).json({ message: 'New Headphone added successfully', newHeadphone });
  } catch (error) {
    console.error("Error while adding Headphone:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to fetch Headphones
router.get('/GetHeadphone', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { Headphone_No: { $regex: search, $options: 'i' } },
          { User_Name: { $regex: search, $options: 'i' } },
          { Type: { $regex: search, $options: 'i' } },
          { Status: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const headphoneData = await Headphone.find(filter).lean().exec();
    const count = await Headphone.countDocuments(filter);
    res.status(200).json({ message: 'Headphone data fetched successfully', headphoneData, count });
  } catch (error) {
    console.error('Error while fetching Headphone data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to count all Headphones
router.get('/CountHeadphone', async (req, res) => {
  try {
    const count = await Headphone.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching Headphone count:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to count Headphones by status
router.get('/CountStatus/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const statusCount = await Headphone.countDocuments({ Status: status });
    res.status(200).json({ status, count: statusCount });
  } catch (error) {
    console.error('Error fetching status count:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update API
router.put('/UpdateHeadphone/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { User_Name, Type, Status } = req.body;

    // Find the document before update for history purposes
    const beforeUpdate = await Headphone.findById(id);
    if (!beforeUpdate) {
      return res.status(404).json({ message: 'Headphone not found' });
    }

    // Create a history record
    await History.create({ updatedHistory: beforeUpdate });

    // Update the Headphone document
    const updatedHeadphone = await Headphone.findByIdAndUpdate(
      id,
      { User_Name, Type, Status },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Headphone updated successfully', updatedHeadphone });
  } catch (error) {
    console.error('Error while updating Headphone:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
