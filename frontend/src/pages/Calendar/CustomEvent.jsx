import React from 'react';
import { FaEye } from 'react-icons/fa';
import { Box, Flex, Text } from '@chakra-ui/react';

const CustomEvent = ({ event, toggleHiddenEvent }) => {

    return (
      <Box position="relative" height="100%" py="3px" overflow="hidden">
        <Flex flexDir={"column"} isTruncated mr={4} >
            <Text fontWeight="semibold" mb={1}>{event.class_id}</Text>
            <Text fontSize={14} mb={1}>{event.title.length > 16 ? event.title.substring(0,15) + "..." : event.title.substring(0,17)}</Text>
            <Text fontSize={12}>{event.location}</Text>
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
            toggleHiddenEvent(event.id);
          }}
        />
      </Box>
    );
  }; 

export default CustomEvent;