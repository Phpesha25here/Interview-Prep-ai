import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';


import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import Interviewprep from "./pages/Interviewprep/Interviewprep";
import UserProvider from './context/usercontext';

const App = () => {
  return (
    <UserProvider>
  
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/interview-prep/:sessionId" element={<Interviewprep />} />
    </Routes>

    <Toaster toastOptions={{
      style: { fontSize: '13px' }
    }} />
  </Router>
  </UserProvider>
  );
};


export default App;
