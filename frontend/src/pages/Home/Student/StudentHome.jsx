import React, { useEffect, useState } from "react";
import {
  Flex,
  Grid,
  Text,
  useToast,
  Spinner
} from '@chakra-ui/react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../../redux/userSlice';
import ClassCard from './ClassCard';
import AddClass from "./AddClass";

const StudentHome = () => {
  const userInfo = useSelector(selectUserInfo);
  const user_id = userInfo.user_id;

  const GET_API_URL = process.env.REACT_APP_API_URL_LOCAL + '/api/user/' + user_id + '/classes';
  const GET_API_ALL_URL = process.env.REACT_APP_API_URL_LOCAL + '/api/classes/all';
  const POST_API_URL = process.env.REACT_APP_API_URL_LOCAL + '/api/user/' + user_id + '/add-class';
  const DELETE_API_URL = process.env.REACT_APP_API_URL_LOCAL + '/api/user/' + user_id + '/delete-class'
  
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [updatedClass, setUpdatedClass] = useState(false);

  const refreshHome = () => {
    setUpdatedClass(!updatedClass);
  }

  // get user classes for dashboard + get ALL classes for search bar autocomplete
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const userClassesResponse = await axios.get(GET_API_URL);
        setClasses(userClassesResponse.data.response);

        const allClassesResponse = await axios.get(GET_API_ALL_URL);
        setAllClasses(allClassesResponse.data.allClasses);

      } catch (error) {
        toast({ title: error.response.data.message, status: 'error', duration: 3000, isClosable: true, position: 'top' });
      
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, [updatedClass]);

  // POST request: add class
  const handleAddClass = (class_id) => {
    const payload = { abbr: class_id }

    axios.post(POST_API_URL, payload)
    .then((response) => {
      const newClass = response.data.newClass;
      setClasses(currentClasses => [...currentClasses, newClass]);
      refreshHome();
      toast({ title: 'added ' + class_id, status: response.data.status, isClosable: true, position: 'top' })
    })
    .catch((error) => {
      toast({ title: error.response.data.message, status: 'error', isClosable: true, position: 'top' })
    })
  }

  // DELETE request: delete class
  const handleDeleteClass = (class_id) => { 
    const payload = { abbr: class_id };

    axios.delete(DELETE_API_URL, {data: payload})
    .then((response) => {
      const deletedClass = response.data.deletedClass;
      const updatedClasses = classes.filter(classItem => classItem.class_id !== deletedClass.class_id);
      setClasses(updatedClasses);
      refreshHome();
      toast({ title: 'deleted class ' + class_id, status: response.data.status, isClosable: true })

    })
    .catch((error) => {
      toast({ title: error.response.data.message, status: 'error', isClosable: true })
    })
  }

  return (
    <Flex px={10} mb={4} w="full">
      <Flex direction="column" justify="start" align="start" w="full">
        <Text fontSize="5xl" fontWeight="bold" mt={4} color="#063763">My Classes</Text>
        <Text fontSize="2xl" fontWeight="bold" opacity="80%" color="#063763" mt={0} mb={6}>({userInfo.role}) {userInfo.name}</Text>
        
        <Flex direction={{ base: 'column', lg: 'row' }} w="full" justify="space-between" align="start">
          <Flex direction="column" flex={1} mr={{ lg: 4 }}>
            <Text fontSize="4xl" fontWeight="bold" color="#063763" mb={8}>Spring 2024</Text>

            {isLoading ? (
              // spinner for loading
              <Flex justify="center" align="center" height="100px">
                <Spinner thickness="4px" speed="0.75s" emptyColor="gray.200" color="blue.500" size="xl"/>
              </Flex>
            ) : (
              // no classes
              <Flex w="full">
                {classes.length === 0 ? (
                  <Flex w="full" flex="3">
                    <Text fontSize={20} textColor="#063763">No classes yet...</Text>
                  </Flex>
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
              
              </Flex>
            )}

          </Flex>

          {/* class search */}
          <Flex direction="column" justifyContent="center" alignItems="center" minWidth="240px" ml={8}>
              <Text fontSize="4xl" fontWeight="bold" color="#063763" mb={8}>Add Class</Text>
              <AddClass handleAddClass={handleAddClass} allClasses={allClasses}/>
          </Flex>

        </Flex>
      </Flex>
    </Flex>
  );
};

export default StudentHome;
