import React, { useState } from "react";
import { ChakraProvider } from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import Auth from "./pages/Auth/Auth";
import StudentHome from "./pages/Home/Student/StudentHome";
import About from "./pages/About/About";
import FAQ from "./pages/FAQ/FAQ";
import Calendar from "./pages/Calendar/Calendar";
import ProfessorHome from "./pages/Home/Professor/ProfessorHome";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    setAuthenticated(true);
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
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;