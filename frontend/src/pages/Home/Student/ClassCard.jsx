import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';

const ClassCard = ({ title, name, hours }) => {
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
            <Flex justify="space-between" align="center">
                <Text fontSize="2xl" fontWeight="bold">{title}</Text>
                <IconButton 
                    icon={<FaTrash size="20" color="black" />}
                    variant="ghost"
                />
            </Flex>
            <Text fontSize="l" fontWeight="semibold" color="gray" mb={20}>{name}</Text>
            
            {/* Banner at the bottom of the card */}
            <Box position="absolute" bottom="0" left="0" right="0" bg="#BFDCFF" px={4} py={3}>
                <Text color="black">{hours} office hours</Text>
            </Box>
        </Box>
    );
};

export default ClassCard;