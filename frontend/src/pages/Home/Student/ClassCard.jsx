import React from 'react';
import {
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';

const ClassCard = ({ title, name, hours }) => {
    return (
        <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        boxShadow="lg"
        bg="white"
        >
        <Flex justify="space-between">
            <Text fontSize="2xl" fontWeight="bold">{title}</Text>
            <FaTrash size="20" color="gray"/>
        </Flex>
        <Text fontSize="l" fontWeight="semibold" mb={12}>{name}</Text>
        <Text>{hours} office hours</Text>
        </Box>
    );
};

export default ClassCard;