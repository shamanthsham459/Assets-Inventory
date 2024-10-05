import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AuthProvider } from '../auth/auth';
import ProtectedRoute from '../auth/ProtectedRoute';

import Login from "../Pages/login/login";
import Dashboard from "../Pages/Dashboard";
import CPU from "../Pages/systems/CPU";
import Monitor from "../Pages/systems/Monitor";
import Keyboard from "../Pages/systems/Keyboard";
import EmployeeName from "../Pages/empname/Employeename";


const Routers = () => {
    return (
        <AuthProvider>
        <Router>
            <Routes>
            {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
            
                <Route path="/" element={<Login />} />

                {/* <ProtectedRoute> */}
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/cpu" element={<ProtectedRoute><CPU /></ProtectedRoute>} />
                <Route path="/monitor" element={<ProtectedRoute><Monitor /></ProtectedRoute>} />
                <Route path="/keyboard" element={<ProtectedRoute><Keyboard /></ProtectedRoute>} />
                {/* <Route path="/mouse" element={<ProtectedRoute><Mouse /></ProtectedRoute>} />
                <Route path="/headphone" element={<ProtectedRoute><Headphone /></ProtectedRoute>} /> */}
                <Route path="/employeename" element={<ProtectedRoute><EmployeeName /></ProtectedRoute>} />
                {/* </ProtectedRoute> */}
            </Routes>
        </Router>
        </AuthProvider>
    )
}

export default Routers;