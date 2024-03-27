import React, { useState } from 'react';
import { Flex, Text, Button, Input, RadioGroup, Radio, Stack, FormControl, FormLabel } from '@chakra-ui/react';

const SignupForm = ({ handleSubmit, handleSwitchAuthState }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');

    const onSubmit = (e) => {
        e.preventDefault();
        const user = {
            name,
            email,
            password,
            role,
        };
        handleSubmit(user);
    };

    return (
        <form onSubmit={onSubmit}>
            <Text fontSize={30} fontWeight={"bold"} color={"#063763"}>Sign Up</Text>
            <FormControl isRequired mt={2} width={"75%"}>
                <FormLabel color={"#063763"} fontWeight={"bold"}>Name</FormLabel>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    bg="white"
                    type="text"
                    mb={5}
                />
                <FormLabel color={"#063763"} fontWeight={"bold"}>Email</FormLabel>
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    bg="white"
                    type="email"
                    mb={5}
                />
                <FormLabel color={"#063763"} fontWeight={"bold"}>Password</FormLabel>
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    bg="white"
                    type="password"
                    mb={5}
                />
                <RadioGroup onChange={setRole} value={role}>
                    <Stack direction="row" mb={5}>
                        <Radio value="Student" colorScheme="blue">Student</Radio>
                        <Radio value="Professor" colorScheme="blue">Professor</Radio>
                        <Radio value="TA" colorScheme="blue">TA/ULA</Radio>
                    </Stack>
                </RadioGroup>
                <Button
                    type="submit"
                    bg="#063763"
                    color="white"
                    _hover={{ bg: 'blue.700' }}
                    borderRadius="5"
                    w="full"
                    fontSize="16"
                    fontWeight="bold"
                    boxShadow="md"
                >
                    Sign Up
                </Button>
                <Flex justifyContent={"center"} mt={3} flexDir={"row"}>
                    <Text mr={1} fontSize={16} fontWeight={"bold"} color={"#063763"}>Already Have An Account?</Text>
                    <Text onClick={handleSwitchAuthState} fontSize={16} fontWeight={"bold"} color={"#4988C1"} cursor={"pointer"}>Login Here!</Text>
                </Flex>
            </FormControl>
        </form>
    );
};

export default SignupForm;