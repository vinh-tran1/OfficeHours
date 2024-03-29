import React from 'react';
import { Box, Text, IconButton } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AddCard = () => {
    const navigate = useNavigate();
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
            onClick={() => navigate("/professor/add")}
        >
            <Box
                cursor="pointer"
                position="absolute"
                top="50%"
                left="0"
                right="0"
                ml="auto"
                mr="auto"
                transform="translateY(-50%)"
                textAlign="center"
                px={4}
                py={3}
            >
                <Text fontSize="3xl" fontWeight="bold">
                    Add Class
                </Text>
                <IconButton icon={<FaPlus size="20" color="black" />} variant="ghost" />
            </Box>
        </Box>
    );
};

export default AddCard;
