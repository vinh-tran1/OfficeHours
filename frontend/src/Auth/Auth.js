import React from 'react';
import { Flex, Text, Heading, Image, Spacer, Button } from '@chakra-ui/react';

const Auth = ({ handleLogin }) => {
  return (
    <Flex flexDir={"column"}>
        <Flex ml={10} pt={50}>
            <Heading fontSize={70} fontWeight={"bold"} color={"#4988C1"}>O</Heading>
            <Heading fontSize={70} fontWeight={"bold"} color={"#063763"}>ffice</Heading>
            <Heading fontSize={70} fontWeight={"bold"} color={"#4988C1"}>(H)</Heading>
            <Heading fontSize={70} fontWeight={"bold"} color={"#063763"}>ours</Heading>
        </Flex>
        <Flex ml={10} flexDir={"row"}>
            <Flex pt={5} flexDirection={"column"}>
                <Flex flexDir={"column"}>
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
                        onClick={handleLogin}
                        >
                    Student Login
                    </Button>
                </Flex>
                <Flex mt={30} flexDir={"column"}>
                    <Text fontSize={20} fontWeight={"bold"} color={"#063763"}>Not a Student? Go Here</Text>
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
                    Professor/TA Login
                    </Button>
                </Flex>
            </Flex>
            <Spacer />
            <Flex mr={40}>
                <Image h={500} w={500} src="calendar.jpeg" alt="Calendar" objectFit="cover" />
            </Flex>
        </Flex>
    </Flex>
  );
};

export default Auth;