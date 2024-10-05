import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { IoCloseCircle } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import '../CSS/common.css';

Modal.setAppElement('#root'); // Set the app element for accessibility

function CPU() {
  let navigate = useNavigate();
  const [cpuData, setData] = useState([]);
  const [addFormData, setAddFormData] = useState({
    CPU_NO: '',
    User_Name: '',
    Type: '',
    OS: '',
    RAM: '',
    Storage: '',
    Status: ''
  });
  const [editFormData, setEditFormData] = useState({
    CPU_NO: '',
    User_Name: '',
    Type: '',
    OS: '',
    RAM: '',
    Storage: '',
    Status: ''
  });
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [cpuCount, setCpuCount] = useState(0);
  const [existingUsers, setExistingUsers] = useState([]);
  const [searchData, setSearchData] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [statusCounts, setStatusCounts] = useState({
    "In Use": 0,
    "In Spare": 0,
    "In Stock": 0,
    "Under Repair": 0,
    "Scrap": 0
  });
  // const [editCpuNo, setEditCpuNo] = useState('');
  const [cpuId, setCpuID] = React.useState('')
  // const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    fetchExistingUsers();
    fetchCpuData();
  }, []);

  const fetchExistingUsers = async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_BASE_URL + 'Getempname');
      setExistingUsers(res.data.empnameData);
    } catch (error) {
      console.log(error, 'error in fetching existing users');
    }
  };

  const fetchCpuData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_BASE_URL + 'Getcpu');
      const data = response.data.cpuData;
      setData(data);
      setCpuCount(data.length);
      calculateStatusCounts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateStatusCounts = (data) => {
    const counts = {
      "In Use": 0,
      "In Spare": 0,
      "In Stock": 0,
      "Under Repair": 0,
      "Scrap": 0
    };

    data.forEach(item => {
      if (counts[item.Status] !== undefined) {
        counts[item.Status] += 1;
      }
    });

    setStatusCounts(counts);
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post(process.env.REACT_APP_BASE_URL + 'Addcpu', addFormData);
      const newData = [...cpuData, response.data.Addcpu];
      setData(newData);
      setCpuCount(cpuCount + 1);
      calculateStatusCounts(newData);

      setAddModalIsOpen(false);
      setAddFormData({
        CPU_NO: '',
        User_Name: '',
        Type: '',
        OS: '',
        RAM: '',
        Storage: '',
        Status: ''
      });
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        console.error(error);
      }
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    console.log(cpuId, 'cpuid')
    try {
      const url = process.env.REACT_APP_BASE_URL + `Updatecpu/${cpuId}`;
      await axios.put(url, editFormData);
      fetchCpuData();

      setEditModalIsOpen(false);
      setEditFormData({
        CPU_NO: '',
        User_Name: '',
        Type: '',
        OS: '',
        RAM: '',
        Storage: '',
        Status: ''
      });
      // setEditCpuNo('');
      setCpuID('')
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        console.error(error);
      }
    }
  };

  const handleAddChange = (event) => {
    setAddFormData({ ...addFormData, [event.target.name]: event.target.value });
  };

  const handleEditChange = (event) => {
    setEditFormData({ ...editFormData, [event.target.name]: event.target.value });
  };

  const handleSearch = async (event) => {
    setSearchData(event.target.value);
    const response = await axios.get(process.env.REACT_APP_BASE_URL + `Getcpu?search=${event.target.value}`);
    const data = response.data.cpuData;
    setData(data);
  };

  // const handleSearchEmpname = async (event) => {
  //   setSearchDataEmpname(event.target.value);
  //   const response = await axios.get(process.env.REACT_APP_BASE_URL + `Getempname?search=${event.target.value}`);
  //   const data = response.data.EmpnameData;
  //   setData(data);
  // };

  const openAddModal = () => {
    setAddModalIsOpen(true);
    setAddFormData({
      CPU_NO: '',
      User_Name: '',
      Type: '',
      OS: '',
      RAM: '',
      Storage: '',
      Status: ''
    });
  };
  const closeAddModal = () => setAddModalIsOpen(false);

  const openEditModal = (data) => {
    setEditFormData({
      CPU_NO: data.CPU_NO,
      User_Name: data.User_Name,
      Type: data.Type,
      OS: data.OS,
      RAM: data.RAM,
      Storage: data.Storage,
      Status: data.Status
    });
    // setEditCpuNo(data.CPU_NO);
    setCpuID(data._id)
    setEditModalIsOpen(true);
  };
  const closeEditModal = () => setEditModalIsOpen(false);

  const exportToExcel = () => {
    const dataToExport = cpuData.map(item => ({
      CPU_NO: item.CPU_NO,
      User_Name: item.User_Name,
      Type: item.Type,
      OS: item.OS,
      RAM: item.RAM,
      Storage: item.Storage,
      Status: item.Status,
      Created_On: item.createdAt,
      Updated_On: item.updatedAt,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CPU Inventory");
    XLSX.writeFile(wb, "cpu_inventory.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("CPU Inventory", 20, 10);
    doc.autoTable({
      head: [['CPU NO', 'User Name', 'Type', 'OS', 'RAM', 'Storage', 'Status']],
      body: cpuData.map(item => [
        item.CPU_NO,
        item.User_Name,
        item.Type,
        item.OS,
        item.RAM,
        item.Storage,
        item.Status,
        // item.createdAt,
        // item.updatedAt,
      ])
    });
    doc.save('cpu_inventory.pdf');
  };

  return (
    <div className="CpuInventory">
      <h1>CPU Inventory</h1>
      <label>
        Search
        <input
          type="text"
          name="Search"
          value={searchData}
          onChange={handleSearch}
          required
        />
      </label>
      <div></div>
      <button onClick={openAddModal}>Add CPU</button>
      <button onClick={exportToExcel}>Export to Excel</button>
      <button onClick={exportToPDF}>Export to PDF</button>
      <button onClick={() => navigate('/dashboard')}>Go Back</button>
      <table>
        <thead>
          <tr>
            <th>Total CPU</th>
            <th>In Use</th>
            <th>In Spare</th>
            <th>In Stock</th>
            <th>Under Repair</th>
            <th>Scrap</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{cpuCount}</td>
            <td>{statusCounts["In Use"]}</td>
            <td>{statusCounts["In Spare"]}</td>
            <td>{statusCounts["In Stock"]}</td>
            <td>{statusCounts["Under Repair"]}</td>
            <td>{statusCounts["Scrap"]}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>CPU NO</th>
            <th>User Name</th>
            <th>Type</th>
            <th>OS</th>
            <th>RAM</th>
            <th>Storage</th>
            <th>Status</th>
            <th>Created On</th>
            <th>Updated On</th>
            <th>Actions</th>
            
          </tr>
        </thead>
        <tbody>
          {cpuData.map((item) => (
            <tr key={item._id}>
              <td>{item.CPU_NO}</td>
              <td>{item.User_Name}</td>
              <td>{item.Type}</td>
              <td>{item.OS}</td>
              <td>{item.RAM}</td>
              <td>{item.Storage}</td>
              <td>{item.Status}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
              {/* <td>{item.createdAt}</td> */}
              <td><button><FaRegEdit onClick={() => openEditModal(item)} /></button> </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add CPU Modal */}
      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add CPU"
      >
        {/* <IoCloseCircle onClick={closeAddModal} /> */}
        <button className="close-modal-btn" onClick={closeAddModal}>
                    <IoCloseCircle size={24} />
                </button>
        <h2>Add CPU</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={handleAddSubmit}>
          <label>
            CPU NO:
            <input
              type="text"
              name="CPU_NO"
              value={addFormData.CPU_NO}
              onChange={handleAddChange}
              required
            />
          </label>
          <div></div>
          <label>
            User Name:
            <select
              name="User_Name"
              value={addFormData.User_Name}
              onChange={handleAddChange}
              required
            >
              <option value="">Select User</option>
              {existingUsers.map((item, i) => (
                <option key={i} value={item.EmpName}>{item.EmpName}</option>
              ))}
            </select>
          </label>
          <div></div>
          <label>
            Type:
            <select
            name="Type"
            value={addFormData.Type}
            onChange={handleAddChange}
            required            
            >
              <option value="">Select Type</option>
              <option value="32bit">32Bit</option>
              <option value="64bit">64Bit</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <div></div>
          <label>
            OS:
            <select
            name="OS"
            value={addFormData.OS}
            onChange={handleAddChange}
            required            
            >
              <option value="">Select OS</option>
              <option value="DB Server">DB Server</option>
              <option value="Windows 7">Windows 7</option>
              <option value="Windows 10">Windows 10</option>
              <option value="Windows 11">Windows 11</option>
              <option value="Ubuntu">Ubuntu</option>
              <option value="Ubuntu 16">Ubuntu 16</option>
              <option value="Ubuntu 18">Ubuntu 18</option>
              <option value="Ubuntu 20">Ubuntu 20</option>
              <option value="Ubuntu 22">Ubuntu 22</option>
              <option value={"Other"}>Other</option>
            </select>
          </label>
          <div></div>
          <label>
            RAM:
            <select
            name="RAM"
            value={addFormData.RAM}
            onChange={handleAddChange}
            required
            >
              <option value="">Select RAM</option>
              <option value="4GB">4GB</option>
              <option value="8GB">8GB</option>
              <option value="12GB">12GB</option>
              <option value="16GB">16GB</option>
              <option value="20GB">20GB</option>
              <option value="24GB">24GB</option>
              <option value="32GB">32GB</option>
              <option value="64GB">64GB</option>
            </select>
          </label>
          <div></div>
          <label>
            Storage:
            {/* <input
              type="text"
              name="Storage"
              value={addFormData.Storage}
              onChange={handleAddChange}
              required
            /> */}
            <select
            name="Storage"
            value={addFormData.Storage}
            onChange={handleAddChange}
            required
            >
              <option value="">Select Storage</option>
              <option value="240GB">240GB</option>
              <option value="500GB">500GB</option>
              <option value="1TB">1TB</option>
              <option value="1.5TB">1.5TB</option>
              <option value="2TB">2TB</option>
              <option value="2.5TB">2.5TB</option>
              <option value="3TB">3TB</option>
            </select>
          </label>
          <div></div>
          <label>
            Status:
            <select
              name="Status"
              value={addFormData.Status}
              onChange={handleAddChange}
              required
            >
              <option value="">Select Status</option>
              <option value="In Use">In Use</option>
              <option value="In Spare">In Spare</option>
              <option value="In Stock">In Stock</option>
              <option value="Under Repair">Under Repair</option>
              <option value="Scrap">Scrap</option>
            </select>
          </label>
          <div></div>
          <button type="submit">Submit</button>
          <button type="button" onClick={closeAddModal}>Cancel</button>
        </form>
      </Modal>

      {/* Edit CPU Modal */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit CPU"
      >
        {/* <IoCloseCircle onClick={closeEditModal} /> */}
        <button className="close-modal-btn" onClick={closeEditModal}>
                    <IoCloseCircle size={24} />
                </button>
        <h2>Edit CPU</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={handleEditSubmit}>
          <label>
            CPU NO:
            <input
              type="text"
              name="CPU_NO"
              value={editFormData.CPU_NO}
              onChange={handleEditChange}
              disabled // Disable CPU_NO input when editing
            />
          </label>
          <div></div>
          <label>
            User Name:
            <select

              name="User_Name"
              value={editFormData.User_Name}
              onChange={handleEditChange}
            >
              {/* {cpuData.map((item) => (
                <option value="">{item.User_Name}</option>
              ))} */}
              
              <option value="" disabled>Select User</option>
              {existingUsers.map((item, i) => (
                <option key={i} value={item.EmpName}>{item.EmpName}</option>
              ))}
            </select>
          </label>
          <div></div>
          <label>
            Type:
            <input
            type="text"
            name="Type"
            value={editFormData.Type}
            onChange={handleEditChange}
            disabled
            />
          </label>
          <div></div>
          <label>
            OS:
            <select
            name="OS"
            value={editFormData.OS}
            onChange={handleEditChange}
            >
              {/* <option value="">{editFormData.OS}</option> */}
              <option value="" disabled>Select OS</option>
              <option value="DB Server">DB Server</option>
              <option value="Windows 7">Windows 7</option>
              <option value="Windows 10">Windows 10</option>
              <option value="Windows 11">Windows 11</option>
              <option value="Ubuntu">Ubuntu</option>
              <option value="Ubuntu 16">Ubuntu 16</option>
              <option value="Ubuntu 18">Ubuntu 18</option>
              <option value="Ubuntu 20">Ubuntu 20</option>
              <option value="Ubuntu 22">Ubuntu 22</option>
              <option value={"Other"}>Other</option>
            </select>
          </label>
          <div></div>
          <label>
            RAM:
            <select
            name="RAM"
            value={editFormData.RAM}
            onChange={handleEditChange}
            >
              <option value="" disabled>Select RAM</option>
              <option value="4GB">4GB</option>
              <option value="8GB">8GB</option>
              <option value="12GB">12GB</option>
              <option value="16GB">16GB</option>
              <option value="20GB">20GB</option>
              <option value="24GB">24GB</option>
              <option value="32GB">32GB</option>
              <option value="64GB">64GB</option>
            </select>
          </label>
          <div></div>
          <label>
            Storage:
            <select
            name="Storage"
            value={editFormData.Storage}
            onChange={handleEditChange}
            >
              <option value="" disabled>Select Storage</option>
              <option value="240GB">240GB</option>
              <option value="500GB">500GB</option>
              <option value="1TB">1TB</option>
              <option value="1.5TB">1.5TB</option>
              <option value="2TB">2TB</option>
              <option value="2.5TB">2.5TB</option>
              <option value="3TB">3TB</option>
            </select>
          </label>
          <div></div>
          <label>
            Status:
            <select
              name="Status"
              value={editFormData.Status}
              onChange={handleEditChange}
            >
              <option value="" disabled>Select Status</option>
              <option value="In Use">In Use</option>
              <option value="In Spare">In Spare</option>
              <option value="In Stock">In Stock</option>
              <option value="Under Repair">Under Repair</option>
              <option value="Scrap">Scrap</option>
            </select>
          </label>
          <div></div>
          <button type="submit">Update</button>
          <button type="button" onClick={closeEditModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
}

export default CPU;
