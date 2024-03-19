import React, { useState } from "react";
import { ChakraProvider } from '@chakra-ui/react'
import './App.css';
import Navbar from "../src/Navbar/Navbar";
import Auth from "./Auth/Auth";
import Home from "./Home/Home";

const App = () => {

  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    setAuthenticated(true)
  }

  return (
    <ChakraProvider>
      <Navbar />
      {authenticated ?
      <Home />
      :
      <Auth handleLogin={handleLogin} />
      }
    </ChakraProvider>
  );
}

export default App;
