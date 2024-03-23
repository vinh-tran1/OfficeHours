import React from 'react';
import { Box, Flex, Text, Image, VStack, SimpleGrid } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const AboutPage = () => {
  // Dummy data for founders
  const team = [
    { name: 'Vinh Tran', student: 'Yale \'25 | Computer Science & Economics', image: '/vinh.png', work: 'Moderna' },
    { name: 'Nikhil Ismail', student: 'Yale \'24.5 | Computer Science', image: '/nikhil.png', work: 'Microsoft' },
    { name: 'Haroon Mohamedali', student: 'Yale \'26 | Computer Science', image: '/haroon.png', work: 'Gerstein Lab' },
  ];

  return (
    <VStack spacing={10} w="full" px={20} py={10} alignItems="center">
      <Text fontSize="4xl" fontWeight="bold" textAlign="center" textColor="#063763">About O(H)</Text>

      <MotionBox
        initial={{ y: 25, opacity: 1 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Flex flexDirection="column" w="60%" align="center" marginLeft="auto" marginRight="auto">
          <Text fontSize="3xl" fontWeight="semibold" textAlign="center">What we hope to solve</Text>
          <Text fontSize="lg" textAlign="center" mt={4}>
          Currently, there is no consistent way to 
          keep track of office hours, peer tutoring, etc. 
          Students often take 4-6 classes, each with their own set of differing 
          schedules: some professors use Google Calendar, some use Google Sheets, so
          me just display it on the Home page of Canvas, 
          while others just put it in their syllabus. 
          Many students input these office hours into their own calendar, 
          an arduous process of creating 10-20 different events and the worst part: 
          OH are updated/canceled as the semester progresses. 
          That means students have to continually look out for announcements, 
          emails, etc. and physically update their own calendars to match.
          </Text>
        </Flex>
      </MotionBox>

      <MotionBox
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <Flex flexDirection="column" w="60%" align="center" marginLeft="auto" marginRight="auto">
          <Text fontSize="3xl" fontWeight="semibold" textAlign="center">What we do</Text>
          <Text fontSize="lg" textAlign="center" mt={4}>
          O(H), or Office(H)ours, is an office hours calendar and visualizer 
          to better organize and coordinate schedules designed 
          with the user in mind. Rather than just being a website that displays 
          set classes OHs, O(H) 
          offers a more individualized way to keep track of OHs.
          </Text>
        </Flex>
      </MotionBox>

      <MotionBox
        initial={{ y: 200, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 3 }}
        viewport={{ once: true }}
      >
        <Text fontSize="3xl" fontWeight="bold" mt={35} mb={4} textAlign="center">Who we are</Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12} mb={6}>
          {team.map((member, index) => (
            <Box key={index} borderWidth="2px" borderColor="#4073AF" borderRadius="lg" overflow="hidden" p={4} bg="#F3F8FF" boxShadow="lg" textAlign="center">
              <Image src={member.image} alt={member.name} borderRadius="full" boxSize="250px" m="auto"/>
              <Text fontSize="xl" fontWeight="semibold" mt={2}>{member.name}</Text>
              <Text fontSize="sm">{member.student}</Text>
              <Text mt={2}>{member.work}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </MotionBox>
    </VStack>
  );
};

export default AboutPage;
