import React, { useState } from "react";
import { ChakraProvider, useToast } from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserInfo, clearUser } from './redux/userSlice';
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

  const STUDENT_LOGIN_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/login/student";
  const ADMIN_LOGIN_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/login/admin";
  const STUDENT_SIGNUP_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/signup/student";
  const ADMIN_SIGNUP_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/signup/admin";

  const dispatch = useDispatch();
  const toast = useToast();

  const [authenticated, setAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(false);

  const handleLogin = (user, onSuccess) => {

    user.role === "Student" ? setAdmin(false) : setAdmin(true)
    const loginUrl = user.role === "Student" ? STUDENT_LOGIN_API_URL : ADMIN_LOGIN_API_URL

    axios.post(loginUrl, user)
    .then((response) => {
      const updatedUser = response.data.user;
      
      dispatch(setUserInfo({
        user_id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: user.role
      }))

      setAuthenticated(true);
      onSuccess();

      console.log("LOGGED IN")
    })
    .catch((error) => {
      setAuthenticated(false);
      toast({ title: error.response.data.response, status: 'error', isClosable: true })
    });
  }

  const handleSignUp = (user, onSuccess) => {

    user.role === "Student" ? setAdmin(false) : setAdmin(true)
    const signUpUrl = user.role === "Student" ? STUDENT_SIGNUP_API_URL : ADMIN_SIGNUP_API_URL;

    axios.post(signUpUrl, user)
    .then((response) => {
      const updatedUser = response.data.user;

      dispatch(setUserInfo({
        user_id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: user.role
      }))

      setAuthenticated(true);
      onSuccess();

      console.log("SIGNED UP")
    })
    .catch((error) => {
      setAuthenticated(false);
      toast({ title: error.response.data.response, status: 'error', isClosable: true })
    });
  }

  const handleLogout = () => {
    dispatch(clearUser());
    setAuthenticated(false);
  }

  // protected routes: only access if authenticated
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
          <Route path="/" element={<Navigate replace={true} to={authenticated ? (admin ? "/professor" : "/student") : "/auth"} />} />
          <Route path="/auth" element={<Auth handleSignUp={handleSignUp} handleLogin={handleLogin} />} />
          {authenticated && <Route path="/auth" element={<Navigate replace={true} to="/" />} />}
          
          <Route path="/student" element={
            <ProtectedRoute>
              <StudentHome />
            </ProtectedRoute>
          } />

          <Route path="/professor" element={
            <ProtectedRoute>
              <ProfessorHome />
            </ProtectedRoute>
          } />

          <Route path="/professor" element={
            <ProtectedRoute>
              <ProfessorHome />
            </ProtectedRoute>
          } />

          <Route path="/professor/add" element={
            <ProtectedRoute>
              <ProfessorAddClass />
            </ProtectedRoute>
          } />

          <Route path="/professor/:id" element={
            <ProtectedRoute>
              <ProfessorClass />
            </ProtectedRoute>
          } />


          <Route path="/calendar" element={<Calendar />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;