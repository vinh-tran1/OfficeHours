import React from 'react';
import { Flex, Text, Spacer, IconButton } from '@chakra-ui/react';
import { FaRegUserCircle } from 'react-icons/fa';

const Navbar = () => {
  return (
    <Flex bg="#063763" color="white" p={5} align="center" flexDirection={"row"}>
      <Flex flexDir={"row"}>
        <Text fontSize={28} fontWeight={"bold"} color={"#BFDCFF"}>O</Text>
        <Text fontSize={28} fontWeight={"bold"} color={"white"}>ffice</Text>
        <Text fontSize={28} fontWeight={"bold"} color={"#BFDCFF"}>(H)</Text>
        <Text fontSize={28} fontWeight={"bold"} color={"#white"}>ours</Text>
      </Flex>
      <Spacer />
      <Flex flexDirection={"row"}>
        <Text fontSize={18} fontWeight={"bold"} p={4}>About</Text>
        <Text fontSize={18} fontWeight={"bold"} p={4}>FAQ</Text>
        <IconButton
          aria-label="Login"
          icon={<FaRegUserCircle size="1.5em" />}
          fontSize={20}
          variant="ghost"
          _hover={{ background: "none", color: "#BFDCFF" }}
          color="white"
          p={7}
        />
      </Flex>
    </Flex>
  );
};

export default Navbar;