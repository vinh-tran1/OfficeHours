import React from "react";
import { Box, Flex, Text, IconButton, Divider } from "@chakra-ui/react";
import { FaEdit, FaRegArrowAltCircleRight, FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const ClassCard = ({ cls, events, ta }) => {
  const navigate = useNavigate();;
  return (
    <Box
      borderWidth="2px"
      borderRadius="lg"
      borderColor="#4073AF"
      overflow="hidden"
      p={4}
      boxShadow="lg"
      bg="#f4f4f4"
      position="relative"
      onClick={() => navigate("/professor/"+ cls.abbr)}
    >
      {/* Class info */}
      <Flex justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          {cls.abbr}
        </Text>
        <Box>
          {/* TODO - UPDATE */}
          <IconButton icon={<FaEdit size="20" color="black" />} variant="ghost" />
          {/* TODO - DELETE */}
          <IconButton icon={<FaTrash size="20" color="black" />} variant="ghost" />
        </Box>

      </Flex>
      <Text fontSize="l" fontWeight="semibold" color="gray">
        {cls.name}
      </Text>
      <Text fontSize="l" fontWeight="semibold" color="gray">
        Location: {cls.room.abbr}
      </Text>

      <Divider color="black" mb={3} mt={3} />

      {/* Professor OH Info */}
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="semibold" color="black">
          My Office Hours
        </Text>
      </Flex>
      {/* <Text fontSize="l" fontWeight="semibold" color="gray">Class: {cls.time}</Text> */}
      {events.map((event, index) => (
        <Box key={index} mb={2}>
          <Text fontSize="l" fontWeight="semibold" color="gray">
            {event.day.toUpperCase()}:
          </Text>
          <Text fontSize="l" fontWeight="semibold" color="gray">
            {event.start + "-" + event.end}
          </Text>
        </Box>
      ))}

      {/* <Divider color="black" mb={3} mt={3} /> */}

      {/* All TAs/ULAs in class
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="semibold" color="black">
          TAs/ULAs
        </Text>
      </Flex> */}
      {/* {ta.map((assistant, index) => (
        <Box key={index}>
          <Text fontSize="l" fontWeight="semibold" color="black">
            {assistant.name}
          </Text>
          <Text fontSize="l" fontWeight="semibold" color="gray">
            Office hours: {assistant.hours}
          </Text>
        </Box>
      ))} */}

      {/* For spacing */}
      <Box mb={20}></Box>

      {/* Banner at the bottom of the card */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        bg="#BFDCFF"
        px={4}
        py={3}
      >
        <Flex justify="space-between" align="center">
          <Text color="black">{cls.hours} office hours</Text>
          <IconButton
            icon={<FaRegArrowAltCircleRight size="20" color="black" />}
            variant="#BFDCFF"
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default ClassCard;
