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

function Keyboard() {
  let navigate = useNavigate();
  const [keyboardData, setData] = useState([]);
  const [addFormData, setAddFormData] = useState({
    Keyboard_No: '',
    User_Name: '',
    Type: '',
    Status: ''
  });
  const [editFormData, setEditFormData] = useState({
    Keyboard_No: '',
    User_Name: '',
    Type: '',
    Status: ''
  });
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [keyboardCount, setKeyboardCount] = useState(0);
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
  const [keyboardId, setKeyboardID] = React.useState('')
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
      const response = await axios.get(process.env.REACT_APP_BASE_URL + 'GetKeyboard');
      const data = response.data.keyboardData;
      setData(data);
      setKeyboardCount(data.length);
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
      const response = await axios.post(process.env.REACT_APP_BASE_URL + 'AddKeyboard', addFormData);
      const newData = [...keyboardData, response.data.AddKeyboard];
      setData(newData);
      setKeyboardCount(keyboardCount + 1);
      calculateStatusCounts(newData);

      setAddModalIsOpen(false);
      setAddFormData({
        Keyboard_No: '',
        User_Name: '',
        Type: '',
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
    console.log(keyboardId, 'Keyboardid')
    try {
      const url = process.env.REACT_APP_BASE_URL + `UpdateKeyboard/${keyboardId}`;
      await axios.put(url, editFormData);
      fetchCpuData();

      setEditModalIsOpen(false);
      setEditFormData({
        Keyboard_No: '',
        User_Name: '',
        Type: '',
        Status: ''
      });
      // setEditCpuNo('');
      setKeyboardID('')
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
    const response = await axios.get(process.env.REACT_APP_BASE_URL + `GetKeyboard?search=${event.target.value}`);
    const data = response.data.keyboardData;
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
      Keyboard_No: '',
      User_Name: '',
      Type: '',
      Status: ''
    });
  };
  const closeAddModal = () => setAddModalIsOpen(false);

  const openEditModal = (data) => {
    setEditFormData({
      Keyboard_No: data.Keyboard_No,
      User_Name: data.User_Name,
      Type: data.Type,
      Status: data.Status
    });
    // setEditCpuNo(data.Keyboard_No);
    setKeyboardID(data._id)
    setEditModalIsOpen(true);
  };
  const closeEditModal = () => setEditModalIsOpen(false);

  const exportToExcel = () => {
    const dataToExport = keyboardData.map(item => ({
      Keyboard_No: item.Keyboard_No,
      User_Name: item.User_Name,
      Type: item.Type,
      Status: item.Status,
      Created_On: item.createdAt,
      Updated_On: item.updatedAt,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Keyboard Inventory");
    XLSX.writeFile(wb, "keyboard_inventory.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Keyboard Inventory", 20, 10);
    doc.autoTable({
      head: [['Keyboard NO', 'User Name', 'Type', 'Status']],
      body: keyboardData.map(item => [
        item.Keyboard_No,
        item.User_Name,
        item.Type,
        item.Status,
        // item.createdAt,
        // item.updatedAt,
      ])
    });
    doc.save('keyboard_inventory.pdf');
  };

  return (
    <div className="KeyboardInventory">
      <h1>Keyboard Inventory</h1>
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
      <button onClick={openAddModal}>Add Keyboard</button>
      <button onClick={exportToExcel}>Export to Excel</button>
      <button onClick={exportToPDF}>Export to PDF</button>
      <button onClick={() => navigate('/dashboard')}>Go Back</button>
      <table>
        <thead>
          <tr>
            <th>Total Keyboard</th>
            <th>In Use</th>
            <th>In Spare</th>
            <th>In Stock</th>
            <th>Under Repair</th>
            <th>Scrap</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{keyboardCount}</td>
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
            <th>Keyboard NO</th>
            <th>User Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Created On</th>
            <th>Updated On</th>
            <th>Actions</th>
            
          </tr>
        </thead>
        <tbody>
          {keyboardData.map((item) => (
            <tr key={item._id}>
              <td>{item.Keyboard_No}</td>
              <td>{item.User_Name}</td>
              <td>{item.Type}</td>
              <td>{item.Status}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
              {/* <td>{item.createdAt}</td> */}
              <td><button><FaRegEdit onClick={() => openEditModal(item)} /></button> </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Keyboard Modal */}
      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add Keyboard"
      >
        {/* <IoCloseCircle onClick={closeAddModal} /> */}
        <button className="close-modal-btn" onClick={closeAddModal}>
                    <IoCloseCircle size={24} />
                </button>
        <h2>Add Keyboard</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={handleAddSubmit}>
          <label>
            Keyboard NO:
            <input
              type="text"
              name="Keyboard_No"
              value={addFormData.Keyboard_No}
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
              <option value="Small">Small</option>
              <option value="Big">Big</option>
              <option value="Other">Other</option>
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

      {/* Edit Keyboard Modal */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Keyboard"
      >
        {/* <IoCloseCircle onClick={closeEditModal} /> */}
        <button className="close-modal-btn" onClick={closeEditModal}>
                    <IoCloseCircle size={24} />
                </button>
        <h2>Edit Keyboard</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={handleEditSubmit}>
          <label>
            Keyboard NO:
            <input
              type="text"
              name="Keyboard_No"
              value={editFormData.Keyboard_No}
              onChange={handleEditChange}
              disabled // Disable Keyboard_No input when editing
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
              {/* {keyboardData.map((item) => (
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

export default Keyboard;
