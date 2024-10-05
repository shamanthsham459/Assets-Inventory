const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Mouse = require('../../models/AssetItems/mouse');
const History = require('../../models/AssetItems/History');

// Post API to add a new Mouse entry
router.post('/AddMouse', async (req, res) => {
  try {
    const { Mouse_No, User_Name, Type, Status } = req.body;

    // Check if Mouse_No already exists
    const existingMouse = await Mouse.findOne({ Mouse_No });
    if (existingMouse) {
      return res.status(400).json({ message: 'Mouse_No already exists' });
    }

    const newMouse = new Mouse({ Mouse_No, User_Name, Type, Status });
    await newMouse.save();

    res.status(201).json({ message: 'New Mouse added successfully', newMouse });
  } catch (error) {
    console.error("Error while adding Mouse:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to fetch Mouses
router.get('/GetMouse', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { Mouse_No: { $regex: search, $options: 'i' } },
          { User_Name: { $regex: search, $options: 'i' } },
          { Type: { $regex: search, $options: 'i' } },
          { Status: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const mouseData = await Mouse.find(filter).lean().exec();
    const count = await Mouse.countDocuments(filter);
    res.status(200).json({ message: 'Mouse data fetched successfully', mouseData, count });
  } catch (error) {
    console.error('Error while fetching Mouse data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to count all Mouses
router.get('/CountMouse', async (req, res) => {
  try {
    const count = await Mouse.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching Mouse count:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to count Mouses by status
router.get('/CountStatus/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const statusCount = await Mouse.countDocuments({ Status: status });
    res.status(200).json({ status, count: statusCount });
  } catch (error) {
    console.error('Error fetching status count:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update API
router.put('/UpdateMouse/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { User_Name, Type, Status } = req.body;

    // Find the document before update for history purposes
    const beforeUpdate = await Mouse.findById(id);
    if (!beforeUpdate) {
      return res.status(404).json({ message: 'Mouse not found' });
    }

    // Create a history record
    await History.create({ updatedHistory: beforeUpdate });

    // Update the Mouse document
    const updatedMouse = await Mouse.findByIdAndUpdate(
      id,
      { User_Name, Type, Status },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Mouse updated successfully', updatedMouse });
  } catch (error) {
    console.error('Error while updating Mouse:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
