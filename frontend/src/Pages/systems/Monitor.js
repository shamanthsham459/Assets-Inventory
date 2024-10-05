// // src/components/MonitorInventory.js

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Modal from 'react-modal';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { useNavigate } from 'react-router-dom';

// Modal.setAppElement('#root'); // Set the app element for accessibility

// function Monitor() {
//   let navigate = useNavigate();
//   const [monitorData, setData] = useState([]);
//   const [formData, setFormData] = useState({
//     Monitor_NO: '',
//     User_Name: '',
//     Type: ''
//   });
//   const [modalIsOpen, setModalIsOpen] = useState(false);

//   useEffect(() => {
//     // Replace with your actual endpoint
//     console.log(process.env.REACT_APP_BASE_URL + 'Getmonitor', 'get api log');
//     axios.get(process.env.REACT_APP_BASE_URL + 'Getmonitor')
//       .then((response) => {
//         setData(response.data.monitorData);
//       })
//       .catch((error) => console.log(error));
//   }, []);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       // Replace with your actual endpoint
//       const response = await axios.post(process.env.REACT_APP_BASE_URL + 'Addmonitor', formData);
//       console.log(response.data);
//       setData([...monitorData, response.data.Addmonitor]);
//       setModalIsOpen(false); // Close the form modal after successful submission
//       setFormData({
//         Monitor_NO: '',
//         User_Name: '',
//         Type: ''
//       }); // Clear the form data
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleChange = (event) => {
//     setFormData({ ...formData, [event.target.name]: event.target.value });
//   };

//   const openModal = () => setModalIsOpen(true);
//   const closeModal = () => setModalIsOpen(false);

//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(monitorData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Monitor Data");
//     XLSX.writeFile(wb, "monitor_data.xlsx");
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Monitor Inventory", 20, 10);
//     doc.autoTable({
//       head: [['Monitor NO', 'User Name', 'Type']],
//       body: monitorData.map(item => [
//         item.Monitor_NO,
//         item.User_Name,
//         item.Type
//       ])
//     });
//     doc.save('monitor_data.pdf');
//   };

//   return (
//     <div className="MonitorInventory">
//       <h1>Monitor Inventory</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Monitor NO</th>
//             <th>User Name</th>
//             <th>Type</th>
//           </tr>
//         </thead>
//         <tbody>
//           {monitorData.map((item) => (
//             <tr key={item._id}>
//               <td>{item.Monitor_NO}</td>
//               <td>{item.User_Name}</td>
//               <td>{item.Type}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <button onClick={openModal}>Add Monitor</button>
//       <button onClick={exportToExcel}>Export to Excel</button>
//       <button onClick={exportToPDF}>Export to PDF</button>
//       <button onClick={() => navigate('/dashboard')}>Go Back</button>

//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         contentLabel="Add Monitor"
//       >
//         <h2>Add Monitor</h2>
//         <form onSubmit={handleSubmit}>
//           <label>
//             Monitor NO:
//             <input
//               type="text"
//               name="Monitor_NO"
//               value={formData.Monitor_NO}
//               onChange={handleChange}
//             />
//           </label>
//           <label>
//             User Name:
//             <input
//               type="text"
//               name="User_Name"
//               value={formData.User_Name}
//               onChange={handleChange}
//             />
//           </label>
//           <label>
//             Type:
//             <input
//               type="text"
//               name="Type"
//               value={formData.Type}
//               onChange={handleChange}
//             />
//           </label>
//           <button type="submit">Submit</button>
//           <button type="button" onClick={closeModal}>Cancel</button>
//         </form>
//       </Modal>
//     </div>
//   );
// }

// export default Monitor;

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

function Monitor() {
  let navigate = useNavigate();
  const [monitorData, setData] = useState([]);
  const [addFormData, setAddFormData] = useState({
    Monitor_No: '',
    User_Name: '',
    Type: '',
    Status: ''
  });
  const [editFormData, setEditFormData] = useState({
    Monitor_No: '',
    User_Name: '',
    Type: '',
    Status: ''
  });
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [monitorCount, setMonitorCount] = useState(0);
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
  const [monitorId, setMonitorID] = React.useState('');

  useEffect(() => {
    fetchExistingUsers();
    fetchMonitorData();
  }, []);

  const fetchExistingUsers = async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_BASE_URL + 'Getempname');
      setExistingUsers(res.data.empnameData);
    } catch (error) {
      console.log(error, 'error in fetching existing users');
    }
  };

  const fetchMonitorData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_BASE_URL + 'GetMonitor');
      const data = response.data.monitorData;
      setData(data);
      setMonitorCount(data.length);
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
      const response = await axios.post(process.env.REACT_APP_BASE_URL + 'AddMonitor', addFormData);
      const newData = [...monitorData, response.data.Addmonitor];
      setData(newData);
      setMonitorCount(monitorCount + 1);
      calculateStatusCounts(newData);

      setAddModalIsOpen(false);
      setAddFormData({
        Monitor_No: '',
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
    console.log(monitorId, 'monitorId')
    try {
      const url = process.env.REACT_APP_BASE_URL + `UpdateMonitor/${monitorId}`;
      await axios.put(url, editFormData);
      fetchMonitorData();

      setEditModalIsOpen(false);
      setEditFormData({
        Monitor_No: '',
        User_Name: '',
        Type: '',
        Status: ''
      });
      setMonitorID('')
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
    const response = await axios.get(process.env.REACT_APP_BASE_URL + `GetMonitor?search=${event.target.value}`);
    const data = response.data.monitorData;
    setData(data);
  };

  const openAddModal = () => {
    setAddModalIsOpen(true);
    setAddFormData({
      Monitor_No: '',
      User_Name: '',
      Type: '',
      Status: ''
    });
  };
  const closeAddModal = () => setAddModalIsOpen(false);

  const openEditModal = (data) => {
    setEditFormData({
      Monitor_No: data.Monitor_No,
      User_Name: data.User_Name,
      Type: data.Type,
      Status: data.Status
    });
    setMonitorID(data._id)
    setEditModalIsOpen(true);
  };
  const closeEditModal = () => setEditModalIsOpen(false);

  const exportToExcel = () => {
    const dataToExport = monitorData.map(item => ({
      Monitor_No: item.Monitor_No,
      User_Name: item.User_Name,
      Type: item.Type,
      Status: item.Status,
      Created_On: item.createdAt,
      Updated_On: item.updatedAt,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monitor Inventory");
    XLSX.writeFile(wb, "monitor_inventory.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Monitor Inventory", 20, 10);
    doc.autoTable({
      head: [['Monitor No', 'User Name', 'Type', 'Status']],
      body: monitorData.map(item => [
        item.Monitor_No,
        item.User_Name,
        item.Type,
        item.Status,
      ])
    });
    doc.save('monitor_inventory.pdf');
  };

  return (
    <div className="MonitorInventory">
      <h1>Monitor Inventory</h1>
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
      <button onClick={openAddModal}>Add Monitor</button>
      <button onClick={exportToExcel}>Export to Excel</button>
      <button onClick={exportToPDF}>Export to PDF</button>
      <button onClick={() => navigate('/dashboard')}>Go Back</button>
      <table>
        <thead>
          <tr>
            <th>Total Monitor</th>
            <th>In Use</th>
            <th>In Spare</th>
            <th>In Stock</th>
            <th>Under Repair</th>
            <th>Scrap</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{monitorCount}</td>
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
            <th>Monitor No</th>
            <th>User Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Created On</th>
            <th>Updated On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {monitorData.map((item) => (
            <tr key={item._id}>
              <td>{item.Monitor_No}</td>
              <td>{item.User_Name}</td>
              <td>{item.Type}</td>
              <td>{item.Status}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
              <td><FaRegEdit onClick={() => openEditModal(item)} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Monitor Modal */}
      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add Monitor"
      >
        <button className="close-modal-btn" onClick={closeAddModal}>
          <IoCloseCircle size={24} />
        </button>
        <h2>Add Monitor</h2>
        <form onSubmit={handleAddSubmit}>
          <label>
            Monitor No
            <input
              type="text"
              name="Monitor_No"
              value={addFormData.Monitor_No}
              onChange={handleAddChange}
              required
            />
          </label>
          <label>
            User Name
            <select
              name="User_Name"
              value={addFormData.User_Name}
              onChange={handleAddChange}
              required
            >
              <option value="">Select User</option>
              {existingUsers.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </label>
          <label>
            Type
            <input
              type="text"
              name="Type"
              value={addFormData.Type}
              onChange={handleAddChange}
              required
            />
          </label>
          <label>
            Status
            <select
              name="Status"
              value={addFormData.Status}
              onChange={handleAddChange}
              required
            >
              <option value="In Use">In Use</option>
              <option value="In Spare">In Spare</option>
              <option value="In Stock">In Stock</option>
              <option value="Under Repair">Under Repair</option>
              <option value="Scrap">Scrap</option>
            </select>
          </label>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Add</button>
        </form>
      </Modal>

      {/* Edit Monitor Modal */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Monitor"
      >
        <button className="close-modal-btn" onClick={closeEditModal}>
          <IoCloseCircle size={24} />
        </button>
        <h2>Edit Monitor</h2>
        <form onSubmit={handleEditSubmit}>
          <label>
            Monitor No
            <input
              type="text"
              name="Monitor_No"
              value={editFormData.Monitor_No}
              onChange={handleEditChange}
              required
            />
          </label>
          <label>
            User Name
            <select
              name="User_Name"
              value={editFormData.User_Name}
              onChange={handleEditChange}
              required
            >
              <option value="">Select User</option>
              {existingUsers.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </label>
          <label>
            Type
            <input
              type="text"
              name="Type"
              value={editFormData.Type}
              onChange={handleEditChange}
              required
            />
          </label>
          <label>
            Status
            <select
              name="Status"
              value={editFormData.Status}
              onChange={handleEditChange}
              required
            >
              <option value="In Use">In Use</option>
              <option value="In Spare">In Spare</option>
              <option value="In Stock">In Stock</option>
              <option value="Under Repair">Under Repair</option>
              <option value="Scrap">Scrap</option>
            </select>
          </label>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Save</button>
        </form>
      </Modal>
    </div>
  );
}

export default Monitor;
