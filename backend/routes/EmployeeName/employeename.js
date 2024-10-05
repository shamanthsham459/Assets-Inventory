const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const empname = require('../../models/EmployeeName/employeename');

// post api to add new empname
router.post('/Addempname', async (req, res) => {
    try {
        const { EmpName } = req.body;

         // Check if EmpName already exists
         const existingEmpname = await cpu.findOne({ $or: [{ EmpName }] });
         if (existingEmpname) {
           return res.status(400).json({ message: 'Employee Name already exists' });
         }

        const Addempname = new empname({ EmpName });
        await Addempname.save();
        res.status(200).json({message: 'New Employee added Successfuly', Addempname});
        // console.log('Data from Addempname', Addempname);
    } 
    catch (error) {
        // console.error("Error while adding new epmname", error);
        res.status(400).json({error: error.message, error});
        
    }
});
// end of post api

// get api to get all empname
router.get('/Getempname', async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = { EmpName: { $regex: search, $options: 'i' } }; // Case-insensitive search
    }

    const empnameData = await empname.find(query);
    const count = await empname.countDocuments(query);
    res.status(200).json({ message: 'empname Data fetch successful', empnameData, count });
  } catch (error) {
    // console.log('Error while getting empname data', error);
    res.status(400).json({ error: error.message, error });
  }
});
// end of get api




module.exports = router;