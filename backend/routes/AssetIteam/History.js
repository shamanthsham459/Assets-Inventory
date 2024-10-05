const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const History = require('../../models/AssetIteams/History')

router.get('/getHistoryData', async (req, res) => {
    try {
      const HistoryData = await History.find();
      const count = await History.countDocuments();
      // console.log(cpuData, 'console of cpuData')
      res.status(200).json({ message: 'History data fetched Successfully', HistoryData: HistoryData, count: count });
    } catch (error) {
      console.log('error while fetching History data', error);
      res.status(500).json({ message: error });
    }
  })



  module.exports = router;