import React, { useEffect, useState } from "react";
import {
  Flex,
  Grid,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import ClassCard from './ClassCard';
import AddClass from "./AddClass";

const StudentHome = () => {
  const user_id = 1;
  const GET_API_URL = process.env.REACT_APP_API_URL_LOCAL + '/student';
  const POST_API_URL = process.env.REACT_APP_API_URL_LOCAL + '/api/user/' + user_id + '/add-class';
  const DELETE_API_URL = process.env.REACT_APP_API_URL_LOCAL + '/api/user/' + user_id + '/delete-class'
  const [classes, setClasses] = useState([]);
  // const [addedClass, setAddedClass] = useState("");

  // dummy student data
  const student = {role: "Student", name: "Vinh"}

  // get classes
  useEffect(() => {
    axios.get(GET_API_URL)
    .then((response) => {
      setClasses(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }, [classes])

  const handleAddClass = (addedClass) => {
    axios.post(POST_API_URL, addedClass)
    .then((response) => {
      setClasses(currentClasses => [...currentClasses, response.newClass])
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const handleDeleteClass = (class_id) => { 
    const payload = {
      user_id: user_id,
      class_id: class_id
    };

    axios.delete(DELETE_API_URL, {data: payload})
    .then((response) => {
      const deletedClass = response.data.deletedClass;
      const updatedClasses = classes.filter(classItem => classItem.class_id !== deletedClass.class_id);
      setClasses(updatedClasses)
    })
    .catch((error) => {
      console.log(error)
    })
  }

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
            {classes && classes.map((classInfo, index) => (
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

          {/* class search */}
          <AddClass handleAddClass={handleAddClass}/>

        </Flex>
      </Flex>
    </Flex>
  );
};

export default StudentHome;
