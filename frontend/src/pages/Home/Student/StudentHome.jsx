import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  Text,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import ClassCard from './ClassCard';

const StudentHome = () => {
  
  const API_URL = process.env.REACT_APP_API_URL_LOCAL + "/student";
  const [classes, setClasses] = useState([]);
  const [addedClass, setAddedClass] = useState("");

  // dummy student data
  const student = {role: "Student", name: "Vinh"}

  // get classes
  useEffect(() => {
    axios.get(API_URL)
    .then((response) => {
      setClasses(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }, [])

  // const handleAddClass = async () => {
  //   console.log(addedClass)
  // }

  // const handledeleteClass = async () => {
  //   console.log("delete")
  // }

  return (
    <Flex px={10}>
      <Flex direction="column" justify="start" align="start" w="full">
        <Text fontSize="5xl" fontWeight="bold" mt={4} color="#063763">My Classes</Text>
        <Text fontSize="2xl" fontWeight="bold" opacity="80%" color="#063763" mt={0} mb={6}>({student.role}) {student.name}</Text>
        <Text fontSize="4xl" fontWeight="bold" color="#063763" mb={8}>Spring 2024</Text>

        {/* grid of classes */}
        <Flex direction={{ base: 'column', lg: 'row' }} w="full">
          {classes.length === 0 && <Text fontSize={20}>No classes yet...</Text>}

          <Grid templateColumns="repeat(3, 1fr)" gap={10} w="full" mb={6} flex="3">
            {classes.map((classInfo, index) => (
              <ClassCard key={index} title={classInfo.title} name={classInfo.name} hours={classInfo.hours} />
            ))}
          </Grid>

          {/* class search */}
          <Box            
            p={4}
            ml={{ lg: 10 }}
            mt={{ base: 6, lg: 0 }}
            borderWidth="2px"
            borderRadius="lg"
            borderColor="#4073AF"
            w={{ base: 'full', lg: 'sm' }}
            h={500}
            bg="#F3F8FF"
            boxShadow="lg"
            flex="1"
          >
            <VStack align="stretch">
              <Text fontSize="2xl" fontWeight="bold" mb={4}>Add Class</Text>
              <InputGroup borderWidth="1px" borderRadius="md" bg="white">
                <InputLeftElement pointerEvents="none">
                  <FaSearch size="20" color="black" />
                </InputLeftElement>
                <Input 
                  type="text" 
                  placeholder="search for a class"
                  onChange={(event) => setAddedClass(event.target.value)} 
                />
              </InputGroup>

              <Text>temporary: {addedClass}</Text>
              {/* dropdown list could go here */}

            </VStack>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StudentHome;
