import React, { useState } from "react";
import { ChakraProvider } from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
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

  const STUDENT_LOGIN_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/login/student";
  const ADMIN_LOGIN_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/login/admin";
  const STUDENT_SIGNUP_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/signup/student";
  const ADMIN_SIGNUP_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/signup/admin";

  const [authenticated, setAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(false);

  const handleLogin = (user, onSuccess) => {

    user.role === "Student" ? setAdmin(false) : setAdmin(true)
    const loginUrl = user.role === "Student" ? STUDENT_LOGIN_API_URL : ADMIN_LOGIN_API_URL

    axios.post(loginUrl, user)
    .then((response) => {
      console.log("LOGGED IN")
      setAuthenticated(true);
      onSuccess();
    })
    .catch((error) => {
      console.log(error);
      setAuthenticated(false);
    });
  }

  const handleSignUp = (user, onSuccess) => {

    user.role === "Student" ? setAdmin(false) : setAdmin(true)
    const signUpUrl = user.role === "Student" ? STUDENT_SIGNUP_API_URL : ADMIN_SIGNUP_API_URL;

    axios.post(signUpUrl, user)
    .then((response) => {
      console.log("SIGNED UP")
      setAuthenticated(true);
      onSuccess();
    })
    .catch((error) => {
      console.log(error);
      setAuthenticated(false);
    });
  }

  const handleLogout = () => {
    setAuthenticated(false);
  }

  const ProtectedRoute = () => {
    if (!authenticated) {
      return <Navigate replace={true} to="/auth" />;
    }
    return <Outlet />;
  };

  return (
    <ChakraProvider>
      <Router>
        <Navbar handleLogout={handleLogout} authenticated={authenticated} />
        <Routes>
          <Route path="/" element={<Navigate replace={true} to={authenticated ? (admin ? "/professor" : "/student") : "/auth"} />} />
          <Route path="/auth" element={<Auth handleSignUp={handleSignUp} handleLogin={handleLogin} />} />
          {authenticated && <Route path="/auth" element={<Navigate replace={true} to="/" />} />}

          {/* protected routes: only access if authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route path="/student" element={<StudentHome /> } />
            <Route path="/professor">
              <Route index element={<ProfessorHome />} />
              <Route path="add" element={<ProfessorAddClass />} />
              <Route path=":id" element={<ProfessorClass />} />
            </Route>
            <Route path="/calendar" element={<Calendar />} />
          </Route>

          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;