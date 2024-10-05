const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const cpu = require('../../models/AssetIteams/cpu');
const History = require('../../models/AssetIteams/History')

// Post api to add a new CPU entry
router.post('/Addcpu', async (req, res) =>{
    try {
      // console.log('inside add cpr api')
        const { CPU_NO, User_Name, Type, OS, RAM, Storage, Status } = req.body;

        // Check if CPU_NO already exists
        const existingCpu = await cpu.findOne({ $or: [{ CPU_NO }] });
        if (existingCpu) {
          return res.status(400).json({ message: 'CPU_NO already exists' });
        }

        const Addcpu = new cpu({ CPU_NO, User_Name, Type, OS, RAM, Storage, Status });
        await Addcpu.save();

        res.status(201).json({message: 'New CPU added Successfuly', Addcpu});
        //console.log(cpu);
        // console.log(Addcpu);
        }
        catch(error){
            // console.error("Error while adding CPU:", error);
            res.status(400).json({error: error.message, error})


    }
})
// end of post api


// Get api to fetch the
router.get('/Getcpu', async (req, res) => {
    try {
      const { search } = req.query;

      // Create a filter object to hold the search criteria
      let filter = {};

      if (search) {
        filter = {
          $or: [
            { CPU_NO: { $regex: search, $options: 'i' } },
            { User_Name: { $regex: search, $options: 'i' } },
            { Type: { $regex: search, $options: 'i' } },
            { OS: { $regex: search, $options: 'i' } },
            { RAM: { $regex: search, $options: 'i' } },
            { Storage: { $regex: search, $options: 'i' } },
            { Status: { $regex: search, $options: 'i' } },
          ],
        };
      }


      const cpuData = await cpu.find(filter).lean().exec();
      const count = await cpu.countDocuments();
      // console.log(cpuData, 'console of cpuData')
      res.status(200).json({ message: 'CPU data fetched Successfully', cpuData: cpuData, count: count });
    } catch (error) {
      // console.log('error while fetching CPU data', error);
      res.status(500).json({ message: error });
    }
  })

router.get('/Countcpu', async (req, res) => {
    try {
      const count = await cpu.countDocuments();
      // console.log(count, 'count of cpu');
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching CPU count', error });
    }
  });

router.get('/Countstatus', async (req, res) => {
    try {
        const status = req.params.Status;
        const statusCount = await cpu.countDocuments({ Status: status });
        res.status(200).json({ status, count: statusCount });
    } catch (error) {
        // console.error("Error fetching status count:", error);
        res.status(500).json({ message: "Error fetching status count", error });
    }
});


// update api
// router.put('/Updatecpu/:id', async (req, res) => {
//   try {
//       const { id } = req.params;
//       const beforeUpdate = await cpu.findOne({id:id })
//       console.log(beforeUpdate,"before updatre data console")
//       const HistoryCreate =  await History.create({updatedHistory:beforeUpdate});
//       console.log(HistoryCreate,'HistoryCreateHistoryCreateHistoryCreateHistoryCreate')
//       const { User_Name, Type, OS, RAM, Storage, Status } = req.body;
//       console.log(id,"id console")
//       const updatedCpu = await cpu.findOneAndUpdate(
//           { id },
//           { User_Name, Type, OS, RAM, Storage, Status },
//           { new: true, runValidators: true },
          
//       );

//       if (!updatedCpu) {
//           return res.status(404).json({ message: 'CPU not found' });
//       }

//       res.status(200).json({ message: 'CPU updated successfully', updatedCpu });
//   } catch (error) {
//       console.error("Error while updating CPU:", error);
//       res.status(400).json({ error: error.message, error });
//   }
// });

router.put('/Updatecpu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { User_Name, Type, OS, RAM, Storage, Status } = req.body;

    // Find the document before update for history purposes
    const beforeUpdate = await cpu.findById(id);
    if (!beforeUpdate) {
      return res.status(404).json({ message: 'CPU not found' });
    }

    // console.log(beforeUpdate, "before update data console");

    // Create a history record
    const historyCreate = await History.create({ updatedHistory: beforeUpdate });
    // console.log(historyCreate, 'History created');

    // Update the CPU document
    const updatedCpu = await cpu.findByIdAndUpdate(
      id,
      { User_Name, Type, OS, RAM, Storage, Status },
      { new: true, runValidators: true }
    );

    if (!updatedCpu) {
      return res.status(404).json({ message: 'CPU not found' });
    }

    res.status(200).json({ message: 'CPU updated successfully', updatedCpu });
  } catch (error) {
    // console.error("Error while updating CPU:", error);
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
