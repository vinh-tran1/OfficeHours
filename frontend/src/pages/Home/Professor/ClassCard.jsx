import React from "react";
import { Box, Flex, Text, IconButton, Divider } from "@chakra-ui/react";
import { FaEdit, FaRegArrowAltCircleRight, FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { convertTo12HourFormat } from "../../../utils";

const ClassCard = ({ cls, events, ta, deleteClass, update }) => {
  const navigate = useNavigate();
  const handleRemoveClass = () => {
    deleteClass(cls.abbr)
  }
  const handleUpdateClass = () => {
    update(cls)
  }
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
    >
      {/* Class info */}
      <Flex justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          {cls.abbr}
        </Text>
        <Box>
          {/* TODO - UPDATE */}
          <IconButton
            icon={<FaEdit size="20" color="black" />}
            variant="ghost"
            onClick={handleUpdateClass} />
          <IconButton
            icon={<FaTrash size="20" color="black" />}
            variant="ghost"
            onClick={handleRemoveClass} />
        </Box>

      </Flex>
      <Text fontSize="l" fontWeight="semibold" color="gray">
        {cls.name}
      </Text>
      <Text fontSize="l" color="gray">
        Location: {cls.room_abbr}
      </Text>

      <Divider color="black" mb={3} mt={3} />

      {/* Professor OH Info */}
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="semibold" color="black">
          My Office Hours
        </Text>
      </Flex>
      {/* <Text fontSize="l" fontWeight="semibold" color="gray">Class: {cls.time}</Text> */}
      {events !== undefined && events.map((event, index) => (
        <Box key={index} mb={2}>
          <Text fontSize="l" fontWeight="semibold" color="gray">
            {event.time}:
          </Text>
          <Text fontSize="l" color="gray">
            {convertTo12HourFormat(event.start) + "-" + convertTo12HourFormat(event.end)}
          </Text>
        </Box>
      ))}

      {events !== undefined && events.length === 0 && <Text mt={2} fontSize="l" fontWeight="semibold" color="gray">No Office Hours</Text>}

      <Divider color="black" mb={3} mt={3} />
      <Flex mb={2} justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="semibold" color="black">
          My TAs/ULAs
        </Text>
      </Flex>
      {ta !== undefined && ta.length > 0 ? ta.map((assistant, index) => (
        <Box key={index}>
          <Text fontSize="l" fontWeight="semibold" color="black">
            {assistant.name}
          </Text>
          <Text fontSize="l" fontWeight="semibold" color="gray">
            Office hours: 3
          </Text>
        </Box>
      ))
        :
        <Text>None Assigned</Text>
      }

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
            onClick={() => navigate("/professor/" + cls.abbr)}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default ClassCard;
