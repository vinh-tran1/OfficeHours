import React from 'react';
import {
  Box,
  Flex,
  Grid,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Container,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import ClassCard from './ClassCard';

const StudentHome = () => {
  // dummy data
  const classes = [
    { title: 'CPSC 419', name: 'Full Stack', hours: '7' },
    { title: 'CPSC 323', name: 'Intro to Systems', hours: '20' },
    { title: 'CPSC 365', name: 'Algorithms', hours: '12' },
    { title: 'CPSC 223', name: 'Data Structures', hours: '4' },
    { title: 'CPSC 429', name: 'Software Engineering', hours: '2' },
    // Add more classes as needed
  ];

  return (
    <Container maxW="container.xl" centerContent>
      <Flex direction="column" align="start" w="full">
        <Text fontSize="4xl" fontWeight="bold" mt={4}>My Classes</Text>
        <Text fontSize="2xl" fontWeight="semibold">Vinh Tran</Text>
        <Text fontSize="l" mb={8}>Spring 2024</Text>

        <Flex direction={{ base: 'column', lg: 'row' }} w="full">
          <Grid templateColumns="repeat(3, 1fr)" gap={6} w="full">
            {classes.map((classInfo, index) => (
              <ClassCard key={index} title={classInfo.title} name={classInfo.name} hours={classInfo.hours} />
            ))}
          </Grid>

          <Box flexShrink={0} ml={10} w={64}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>Add Class</Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaSearch size="20" color="gray" />
              </InputLeftElement>
              <Input type="text" placeholder="Search for a class" />
            </InputGroup>
            {/* Dropdown list would go here */}
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
};

export default StudentHome;
