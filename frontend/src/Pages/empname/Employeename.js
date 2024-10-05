import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";
import '../CSS/common.css';
import { IoCloseCircle } from "react-icons/io5";

Modal.setAppElement('#root');

function EmployeeName() {
    let navigate = useNavigate();
    const [empnameData, setEmpnameData] = useState([]);
    const [empnameCount, setEmpnameCount] = useState(0);
    const [searchData, setSearchData] = useState('');
    const [formData, setFormData] = useState({
        EmpName: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // console.log(process.env.REACT_APP_BASE_URL + 'Getempname');
    // useEffect(()=>{
    //     EmployeeusersData()
    // },[])
    // const EmployeeusersData =() => {
    //     axios.get(process.env.REACT_APP_BASE_URL + 'Getempname')
    //     .then((res)=>{
    //         setEmpnameData(res.data.empnameData);
    //     })
    //     .catch((errorMessage)=>{
    //         console.log(errorMessage,'error is EmployeeusersData');
    //     })
    // }
//  console.log(empnameData,'data from empnameData');

useEffect(() => {
    const fetchEmpnameData = async () => {
        // console.log(process.env.REACT_APP_BASE_URL + `Getempname?search=${searchData}`);
        try {
            const response = await axios.get(process.env.REACT_APP_BASE_URL + `Getempname?search=${searchData}`)
            // console.log(response.data, 'get api');
            const data = response.data.empnameData;
            setEmpnameData(data);
            setEmpnameCount(data.length);
        } catch (error) {
            // console.log('Error while fetching data from Getempname', error);
            setErrorMessage('Failed to fetch employee names');
        }
    };
    fetchEmpnameData();
}, [searchData]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        try {
            const response = await axios.post(process.env.REACT_APP_BASE_URL + 'Addempname', formData);
            console.log(response.data);
            setEmpnameData([...empnameData, response.data.Addempname]);
            setEmpnameCount(empnameCount + 1);
            setFormData({ EmpName: '' }); // Clear form data after submission
            setModalIsOpen(false); // Close the modal
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'EmpName already exists');
        }
    };

    // console.log(empnameData,'console');
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };


    // const handleSearch = async (event) => {
    //     {
    //       setSearchData(event.target.value)
    //       const response = await axios.get(process.env.REACT_APP_BASE_URL + `Getempname?search=${event.target.value}`);
    //       const data = response.data.empnameData;
    //       setEmpnameData(data);
    //       // setCpuCount(data.length);
    //       // calculateStatusCounts(data); // Update status counts
    //     };
    //   };

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <div className="EmployeeName">
            <h1>Employee Names</h1>
            <label>
          Search
          <input
            type="text"
            name="Search"
            value={searchData}
            onChange={(e)=>setSearchData(e.target.value)}
            required // Add required attribute
          />
        </label><div></div>
            <button onClick={openModal}>Add Employee Name</button>
            <button onClick={() => navigate('/dashboard')}>Go Back</button>
            <h3>Total Employees : {empnameData.length}</h3>
            
            <table>
                <thead>
                    <tr>
                        <th>Employee Name</th>
                    </tr>
                </thead>
                <tbody>
                {empnameData.length > 0 ?
                    (empnameData && empnameData.map((item) => (
                        <tr>
                            <td>{item.EmpName}</td>

                        </tr>
                    )))
                    : (
                        <p style={{textAlign:'center',color:'Gray'}}>No Data found</p>
                    )}
                </tbody>
            </table>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Add Employee Name"
            >
                <button className="close-modal-btn" onClick={closeModal}>
                    <IoCloseCircle size={24} />
                </button>
                <h2>Add Employee Name</h2>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                <form onSubmit={handleSubmit}>
                    <label>
                        Employee Name:
                        <input
                            type="text"
                            name="EmpName"
                            value={formData.EmpName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>
        </div>
    );
}

export default EmployeeName;
