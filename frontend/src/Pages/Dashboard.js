import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth";
import './CSS/common.css';
// import './CSS/Dashboard.css'

export default function Dashboard () {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = async () => {
        try {
            await logout();
            // navigate('/');
            }
        catch (error) {
            console.error(error);
            }
    };

    
    return (
        <><center><h1>Asset's Inventory Dashboard</h1></center>
        <center><div></div><div></div><div></div>
        <button onClick={() => navigate('/cpu')}>CPU</button>
        <button onClick={() => navigate('/monitor')}>Monitor</button>
        <button onClick={() => navigate('/keyboard')}>Keyboard</button>
        <button onClick={() => navigate('/mouse')}>Mouse</button>
        <button onClick={() => navigate('/headphone')}>Headphone</button><div></div>
        <button onClick={() => navigate('/employeename')}>Employee's Name</button><div></div>

        <button onClick={handleLogout}>Logout</button>

        </center>
        </>
    )
}