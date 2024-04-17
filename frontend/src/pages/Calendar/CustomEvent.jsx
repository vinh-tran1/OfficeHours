import React from 'react';
import { FaEye } from 'react-icons/fa';
import { Box, Flex, Text } from '@chakra-ui/react';
import convertTo12HourFormat from "../../utils";

const CustomEvent = ({ event, toggleHiddenEvent }) => {

    return (
      <Box position="relative" height="100%" py="3px" overflow="hidden">
        <Flex flexDir={"column"} isTruncated mr={4} >
            <Text mb={1}>{event.class_id}</Text>
            <Text mb={1}>{event.title.length > 11 ? event.title.substring(0,10) + "..." : event.title.substring(0,12)}</Text>
            <Text>{event.location}</Text>
        </Flex>
        <Box
          position="absolute"
          top="0px"
          right="2px"
          cursor="pointer"
          fontSize="1.2em"
          as={FaEye}
          onClick={(e) => {
            e.stopPropagation();
            toggleHiddenEvent(event.title);
          }}
        />
      </Box>
    );
  }; 

export default CustomEvent;