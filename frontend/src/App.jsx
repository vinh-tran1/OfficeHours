import React, { useState } from "react";
import { ChakraProvider } from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import Auth from "./pages/Auth/Auth";
import StudentHome from "./pages/Home/Student/StudentHome";
import About from "./pages/About/About";
import FAQ from "./pages/FAQ/FAQ";
import Calendar from "./pages/Calendar/Calendar";
import ProfessorHome from "./pages/Home/Professor/ProfessorHome";
import { ProfessorAddClass } from "./pages/Create/Class/AddClass";
import { ProfessorClass } from "./pages/Class/Professor/ProfessorClass";

const App = () => {

  const AUTH_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/auth";

  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    axios.get(AUTH_API_URL)
    .then((response) => {
      console.log("LOGGED IN")
      setAuthenticated(true);
    })
    .catch((error) => {
      console.log(error);
      setAuthenticated(false);
    });
  }

  const handleLogout = () => {
    setAuthenticated(false);
  }

  const ProtectedRoute = ({ children }) => {
    if (!authenticated) {
      return <Navigate replace={true} to="/auth" />;
    }
    return children;
  };

  return (
    <ChakraProvider>
      <Router>
        <Navbar handleLogout={handleLogout} authenticated={authenticated} />
        <Routes>
          <Route path="/" element={<Navigate replace={true} to={authenticated ? "/student" : "/auth"} />} />
          <Route path="/auth" element={<Auth handleLogin={handleLogin} />} />
          {authenticated && <Route path="/auth" element={<Navigate replace={true} to="/student" />} />}
          
          {/* protected routes: only access if authenticated */}
          <Route path="/student" element={
            <ProtectedRoute>
              <StudentHome />
            </ProtectedRoute>
          } />

          {/* find way to differentiate for professor to have routes for them */}
          <Route path="/professor" element={<ProfessorHome />} />
          <Route path="/professor/add" element={<ProfessorAddClass />} />
          <Route path="/professor/:id" element={<ProfessorClass />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;