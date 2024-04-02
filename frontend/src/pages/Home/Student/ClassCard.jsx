import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';

const ClassCard = ({ abbr, name, hours, time, handleDeleteClass }) => {
    const handleRemoveClass = () => {
        handleDeleteClass(abbr)
    }

    return (
        <Box
            borderWidth="2px"
            borderRadius="lg"
            borderColor="#4073AF"
            overflow="hidden"
            p={4}
            h={200}
            boxShadow="lg"
            bg="#f4f4f4"
            position="relative"
        >
            <Flex justify="space-between" align="center">
                <Text fontSize="2xl" fontWeight="bold">{abbr}</Text>
                <IconButton 
                    icon={<FaTrash size="20" color="black" />}
                    variant="ghost"
                    onClick={handleRemoveClass}
                />
            </Flex>
            <Text fontSize="lg" fontWeight="semibold" color="#444444" mb={2}>{name}</Text>
            <Text fontSize="lg" color="#666666" mb={20}>{time}</Text>
            
            {/* Banner at the bottom of the card */}
            <Box position="absolute" bottom="0" left="0" right="0" bg="#BFDCFF" px={4} py={3}>
                <Text color="black">{hours} office hours</Text>
            </Box>
        </Box>
    );
};

export default ClassCard;