import React from 'react';
import {
  Flex,
  Grid,
  Text,
} from '@chakra-ui/react'
import { Admin } from '../../../classes/Admin';
import { Class } from '../../../classes/Class';
import { Room } from '../../../classes/Room';
import { ZipCode } from '../../../classes/ZipCode';
import ClassCard from './ClassCard';
import { Event } from '../../../classes/Event';
import AddCard from './AddCard';

const ProfessorHome = () => {

  // TODO - pull classes && office hours
  const admin = new Admin("id", "Alan Weide", "Professor", "alan.weide@yale.edu")
  const hillhouse = new Room("id", "DL 419", "10 Hillhouse Avenue", new ZipCode("06511", "New Haven", "CT"));
  const monday = new Event("id", hillhouse, "short description", "Monday", "4:00pm", "5:00pm");
  const tuesday = new Event("id", hillhouse, "short description", "Tuesday", "4:00pm", "5:00pm")
  const classes = [
    { "class": new Class("CPSC 419", "Full Stack", hillhouse, "MW 1:00pm-2:15pm", '7'), "events": [monday, tuesday], "ta": [new Admin("id", "Person 1", "TA", "person1@gmail.com", "3"), new Admin("id", "Person 2", "ULA", "person2@gmail.com", "2")]},
    { "class": new Class("CPSC 223", "Data Structures", hillhouse, "TTh 2:30pm-5:15pm", '8'), "events": [monday, tuesday], "ta": [new Admin("id", "Person 1", "TA", "person1@gmail.com", "3"), new Admin("id", "Person 2", "ULA", "person2@gmail.com", "2"), new Admin("id", "Person 3", "ULA", "person3@gmail.com", "1")]}
  ];

  return (
    <Flex px={10}>
      <Flex direction="column" justify="start" align="start" w="full">
        <Text fontSize="5xl" fontWeight="bold" mt={4} color="#063763">My Classes</Text>
        <Text fontSize="2xl" fontWeight="bold" opacity="80%" color="#063763" mt={0} mb={6}>({admin.role}) {admin.name}</Text>
        <Text fontSize="4xl" fontWeight="bold" color="#063763" mb={8}>Spring 2024</Text>

        {/* grid of classes */}
        <Flex direction={{ base: 'column', lg: 'row' }} w="full">
          <Grid templateColumns="repeat(4, 1fr)" gap={10} w="full" mb={6} flex="4">
            {classes.map((cls, index) => (
              <ClassCard key={index} cls={cls.class} events={cls.events} ta={cls.ta} />
            ))}
            <AddCard />
          </Grid>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProfessorHome;