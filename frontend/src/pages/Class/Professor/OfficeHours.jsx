import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { capitalize, convertTo12HourFormat } from '../../../utils';

export const OfficeHoursCard = ({ id, location, time, start, end, deleteEvent }) => {
    const handleRemoveEvent = () => {
        deleteEvent(id)
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
            w="full"
        >
            <Flex justify="space-between" align="center">
                <Text fontSize="2xl" fontWeight="bold">{capitalize(time)}</Text>
                <IconButton 
                    icon={<FaTrash size="20" color="black" />}
                    variant="ghost"
                    onClick={handleRemoveEvent}
                />
            </Flex>
            <Text fontSize="l" fontWeight="semibold" color="gray" mb={0}>Location: {location}</Text>
            <Text color="gray">Time: {convertTo12HourFormat(start)} - {convertTo12HourFormat(end)}</Text>
        </Box>
    );
};
