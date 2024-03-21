import React from 'react';
import { Flex, Text, Heading, Image, Spacer, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ handleLogin }) => {

  const navigate = useNavigate();

  const handleStudentLogin = () => {
    handleLogin();
    navigate('/');
  };

  return (
    <Flex flexDir={"row"}>
        <Flex ml={20} flexDir={"column"}>
            <Flex pt={50}>
                <Heading fontSize={100} fontWeight={"bold"} color={"#4988C1"}>O</Heading>
                <Heading fontSize={100} fontWeight={"bold"} color={"#063763"}>ffice</Heading>
                <Heading fontSize={100} fontWeight={"bold"} color={"#4988C1"}>(H)</Heading>
                <Heading fontSize={100} fontWeight={"bold"} color={"#063763"}>ours</Heading>
            </Flex>
            <Flex flexDir={"column"} mb={10}>
                <Text fontSize={18} fontWeight={600} color={"#063763"} fontStyle={"italic"}>Making Office Hours Simple</Text>
                <Text fontSize={18} fontWeight={600} color={"#063763"} fontStyle={"italic"}>Add, view, and edit office hours in only O(H) time!</Text>
            </Flex>
            <Flex mt={30} flexDir={"column"}>
                <Text fontSize={20} fontWeight={"bold"} color={"#063763"}>Student? Please Sign In Here</Text>
                <Text mt={1} fontSize={16} fontWeight={"bold"} color={"#4988C1"}>A valid Yale NetID is required</Text>
                <Button
                    mt={3}
                    bg="#063763"
                    color="white"
                    _hover={{ bg: 'blue.700' }}
                    borderRadius="5"
                    w={275}
                    fontSize="16"
                    fontWeight="bold"
                    boxShadow="md"
                    onClick={handleStudentLogin}
                    >
                Student Login
                </Button>
            </Flex>
            <Flex mt={30} flexDir={"column"}>
                <Text fontSize={20} fontWeight={"bold"} color={"#063763"}>Professor? Please Sign In Here</Text>
                <Button
                    mt={3}
                    bg="#063763"
                    color="white"
                    _hover={{ bg: 'blue.700' }}
                    borderRadius="5"
                    w={275}
                    fontSize="16"
                    fontWeight="bold"
                    boxShadow="md"
                    >
                Professor Login
                </Button>
            </Flex>
            <Flex mt={30} flexDir={"column"}>
                <Text fontSize={20} fontWeight={"bold"} color={"#063763"}>TA or ULA? Please Sign Ins Here</Text>
                <Text mt={1} fontSize={16} fontWeight={"bold"} color={"#4988C1"}>A valid Yale NetID is required</Text>
                <Button
                    mt={3}
                    bg="#063763"
                    color="white"
                    _hover={{ bg: 'blue.700' }}
                    borderRadius="5"
                    w={275}
                    fontSize="16"
                    fontWeight="bold"
                    boxShadow="md"
                    >
                TA/ULA Login
                </Button>
            </Flex>
        </Flex>
        <Spacer />
        <Flex mt={150} mr={60}>
            <Image h={600} w={600} src="calendar.jpeg" alt="Calendar" objectFit="cover" />
        </Flex>
    </Flex>
  );
};

export default Auth;