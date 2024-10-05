// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');

// const monitor = require('../../models/AssetIteams/monitor');

// //
// router.post('/Addmonitor', async (req, res) => {
//     try {
//         const { Monitor_No, User_Name, Type } = req.body;
//         const Addmonitor = new monitor({ Monitor_No, User_Name, Type, Status });
//         await Addmonitor.save();

//         res.status(201).json({message: 'New Monitor added Successfully', Addmonitor});
//         console.log(Addmonitor);
//     } catch (error) {
//         console.error("Error while adding Monitor:", error);
//         res.status(400).json({error: error.message, error})
//     }
// }
// )



const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Monitor = require('../../models/AssetItems/monitor');
const History = require('../../models/AssetItems/History');

// Post API to add a new Monitor entry
router.post('/AddMonitor', async (req, res) => {
  try {
    const { Monitor_No, User_Name, Type, Status } = req.body;

    // Check if Monitor_No already exists
    const existingMonitor = await Monitor.findOne({ Monitor_No });
    if (existingMonitor) {
      return res.status(400).json({ message: 'Monitor_No already exists' });
    }

    const newMonitor = new Monitor({ Monitor_No, User_Name, Type, Status });
    await newMonitor.save();

    res.status(201).json({ message: 'New Monitor added successfully', newMonitor });
  } catch (error) {
    console.error("Error while adding Monitor:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to fetch Monitors
router.get('/GetMonitor', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { Monitor_No: { $regex: search, $options: 'i' } },
          { User_Name: { $regex: search, $options: 'i' } },
          { Type: { $regex: search, $options: 'i' } },
          { Status: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const monitorData = await Monitor.find(filter).lean().exec();
    const count = await Monitor.countDocuments(filter);
    res.status(200).json({ message: 'Monitor data fetched successfully', monitorData, count });
  } catch (error) {
    console.error('Error while fetching Monitor data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to count all Monitors
router.get('/CountMonitor', async (req, res) => {
  try {
    const count = await Monitor.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching Monitor count:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get API to count Monitors by status
router.get('/CountStatus/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const statusCount = await Monitor.countDocuments({ Status: status });
    res.status(200).json({ status, count: statusCount });
  } catch (error) {
    console.error('Error fetching status count:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update API
router.put('/UpdateMonitor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { User_Name, Type, Status } = req.body;

    // Find the document before update for history purposes
    const beforeUpdate = await Monitor.findById(id);
    if (!beforeUpdate) {
      return res.status(404).json({ message: 'Monitor not found' });
    }

    // Create a history record
    await History.create({ updatedHistory: beforeUpdate });

    // Update the Monitor document
    const updatedMonitor = await Monitor.findByIdAndUpdate(
      id,
      { User_Name, Type, Status },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Monitor updated successfully', updatedMonitor });
  } catch (error) {
    console.error('Error while updating Monitor:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
