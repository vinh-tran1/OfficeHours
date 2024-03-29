import React, { useState } from "react";
import { ChakraProvider, useToast } from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
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