import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Flex, Text, Heading, Image, Spacer } from '@chakra-ui/react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const Auth = ({ handleLogin, handleSignUp }) => {

    const navigate = useNavigate();

    const [authState, setAuthState] = useState('login');

    const handleSubmit = (user) => {
        const onSuccess = () => navigate(user.role === "Student" ? '/student' : '/professor');
        if (authState === "login") {
            handleLogin(user, onSuccess);
        } else {
            handleSignUp(user, onSuccess);
        }
    };
    

    const handleSwitchAuthState = () => {
        authState === "login" ? setAuthState("signup") : setAuthState("login")
    }

    return (
        <Flex flexDir={"row"}>
            <Flex ml={20} mt={10} flexDir={"column"}>
                <Flex>
                    <Heading fontSize={100} fontWeight={"bold"} color={"#4988C1"}>O</Heading>
                    <Heading fontSize={100} fontWeight={"bold"} color={"#063763"}>ffice</Heading>
                    <Heading fontSize={100} fontWeight={"bold"} color={"#4988C1"}>(H)</Heading>
                    <Heading fontSize={100} fontWeight={"bold"} color={"#063763"}>ours</Heading>
                </Flex>
                <Flex flexDir={"column"} mb={2}>
                    <Text fontSize={18} fontWeight={600} color={"#063763"} fontStyle={"italic"}>Making Office Hours Simple</Text>
                    <Text fontSize={18} fontWeight={600} color={"#063763"} fontStyle={"italic"}>Add, view, and edit office hours in only O(H) time!</Text>
                </Flex>
                { authState === "login" ?
                <LoginForm handleSwitchAuthState={handleSwitchAuthState} handleSubmit={handleSubmit} />
                :
                <SignupForm handleSwitchAuthState={handleSwitchAuthState} handleSubmit={handleSubmit} />
                }
            </Flex>
            <Spacer />
            <Flex mt={150} mr={60}>
                <Image h={600} w={600} src="calendar.jpeg" alt="Calendar" objectFit="cover" />
            </Flex>
        </Flex>
    );
};

export default Auth;