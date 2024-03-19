import React, { useState } from "react";
import { ChakraProvider } from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './App.css';
import Navbar from "../src/Navbar/Navbar";
import Auth from "./Auth/Auth";
import StudentHome from "./Home/StudentHome";
import About from "./About/About";
import FAQ from "./FAQ/FAQ";
import Calendar from "./Calendar/Calendar";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    setAuthenticated(true);
  }

  const handleLogout = () => {
    setAuthenticated(false);
  }

  return (
    <ChakraProvider>
      <Router>
        <Navbar handleLogout={handleLogout} authenticated={authenticated} />
        <Routes>
          <Route path="/" element={authenticated ? <StudentHome /> : <Navigate replace={true} to="/auth" />} />
          <Route path="/auth" element={<Auth handleLogin={handleLogin} />} />
          {authenticated && <Route path="/auth" element={<Navigate replace={true} to="/" />} />}
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;