import React from 'react';
import { Flex, Text, Spacer, IconButton } from '@chakra-ui/react';
import { FaRegUserCircle } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = ({ authenticated, handleLogout }) => {
  return (
    <Flex bg="#063763" color="white" p={5} align="center" flexDirection={"row"}>
      <Flex flexDir={"row"}>
        <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Text fontSize={28} fontWeight={"bold"} color={"#BFDCFF"}>O</Text>
          <Text fontSize={28} fontWeight={"bold"} color={"white"}>ffice</Text>
          <Text fontSize={28} fontWeight={"bold"} color={"#BFDCFF"}>(H)</Text>
          <Text fontSize={28} fontWeight={"bold"} color={"white"}>ours</Text>
        </RouterLink>
      </Flex>
      <Spacer />
      <Flex alignItems="center">
        {authenticated &&
        <RouterLink to="/calendar">
          <Text fontSize={18} fontWeight={"bold"} px={4}>Calendar</Text>
        </RouterLink>
        }
        <RouterLink to="/about">
          <Text fontSize={18} fontWeight={"bold"} px={4}>About</Text>
        </RouterLink>
        <RouterLink to="/faq">
          <Text fontSize={18} fontWeight={"bold"} px={4}>FAQ</Text>
        </RouterLink>
        <IconButton
          px={4}
          aria-label="Login"
          icon={<FaRegUserCircle size="1.5em" />}
          fontSize={20}
          variant="ghost"
          _hover={{ background: "none", color: "#BFDCFF" }}
          color="white"
          onClick={handleLogout}
        />
      </Flex>
    </Flex>
  );
};

export default Navbar;