import React, { useEffect, useState } from "react";
import {
  Flex,
  Grid,
  Text,
  useToast,
  Spinner
} from '@chakra-ui/react';
import axios from 'axios';
import ClassCard from './ClassCard';
import AddClass from "./AddClass";

const StudentHome = () => {
  const user_id = 3; // dummy data
  const GET_API_URL = process.env.REACT_APP_API_URL_LOCAL + '/api/user/' + user_id;
  const POST_API_URL = process.env.REACT_APP_API_URL_LOCAL + '/api/user/' + user_id + '/add-class';
  const DELETE_API_URL = process.env.REACT_APP_API_URL_LOCAL + '/api/user/' + user_id + '/delete-class'
  
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [updatedClass, setUpdatedClass] = useState(false);

  const refreshHome = () => {
    setUpdatedClass(!updatedClass);
  }

  // dummy data
  const student = {role: 'student', name: 'Vinh Tran'}

  // get classes
  useEffect(() => {
    setIsLoading(true);
    axios.get(GET_API_URL)
    .then((res) => {
      const data = res.data;
      setClasses(data.response);
    })
    .catch((error) => {
      toast({ title: 'ERROR', status: 'error', isClosable: true })
    })
    .finally(() => {
      setIsLoading(false);
    })
  }, [updatedClass])

  const handleAddClass = (class_id) => {
    const payload = { abbr: class_id }

    axios.post(POST_API_URL, payload)
    .then((res) => {
      const data = res.data;
      const newClass = data.response.newClass;
      setClasses(currentClasses => [...currentClasses, newClass]);
      refreshHome();
      toast({ title: 'adding ' + class_id, status: res.data.status, isClosable: true })
    })
    .catch((error) => {
      toast({ title: 'ERROR', status: 'error', isClosable: true })
    })
  }

  const handleDeleteClass = (class_id) => { 
    const payload = { abbr: class_id };

    axios.delete(DELETE_API_URL, {data: payload})
    .then((res) => {
      const data = res.data;
      const deletedClass = data.response.deletedClass;
      const updatedClasses = classes.filter(classItem => classItem.class_id !== deletedClass.class_id);
      setClasses(updatedClasses);
      refreshHome();
      toast({ title: 'deleting class ' + class_id, status: res.data.status, isClosable: true })

    })
    .catch((error) => {
      toast({ title: 'ERROR', status: 'error', isClosable: true })
    })
  }

  return (
    <Flex px={10}>
      <Flex direction="column" justify="start" align="start" w="full">
        <Text fontSize="5xl" fontWeight="bold" mt={4} color="#063763">My Classes</Text>
        <Text fontSize="2xl" fontWeight="bold" opacity="80%" color="#063763" mt={0} mb={6}>({student.role}) {student.name}</Text>
        <Text fontSize="4xl" fontWeight="bold" color="#063763" mb={8}>Spring 2024</Text>

        {isLoading ? (
          // spinner for loading
          <Flex justify="center" align="center" height="100px">
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl"/>
          </Flex>
        ) : (
          // no classes
          <Flex direction={{ base: 'column', lg: 'row' }} w="full">
            {classes.length === 0 ? (
              <Text fontSize={20} textColor="#063763">No classes yet...</Text>
            ) : (
              // grid of classes
              <Grid templateColumns="repeat(3, 1fr)" gap={10} w="full" mb={6} flex="3">
                {classes.length > 0 && classes.map((classInfo, index) => (
                  classInfo && 
                  <ClassCard 
                    key={index} 
                    abbr={classInfo.abbr} 
                    name={classInfo.name} 
                    hours={classInfo.hours} 
                    time={classInfo.time}
                    handleDeleteClass={handleDeleteClass}
                  />
                ))}
              </Grid>
            )}

          {/* class search */}
            <AddClass handleAddClass={handleAddClass} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default StudentHome;
