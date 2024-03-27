import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { capitalize } from '../../../utils';

export const OfficeHoursCard = ({ location, time, start, end }) => {
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
            w="full"
        >
            <Flex justify="space-between" align="center">
                <Text fontSize="2xl" fontWeight="bold">{capitalize(time)}</Text>
                {/* TODO - delete OH */}
                <IconButton 
                    icon={<FaTrash size="20" color="black" />}
                    variant="ghost"
                />
            </Flex>
            <Text fontSize="l" fontWeight="semibold" color="gray" mb={0}>Location: {location}</Text>
            <Text color="gray" fontWeight="semibold">Time: {start} - {end}</Text>
        </Box>
    );
};
