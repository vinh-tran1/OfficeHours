import React from "react";
import { Box, Flex, Text, IconButton, Divider } from "@chakra-ui/react";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { convertTo12HourFormat } from "../../../utils";

const ClassCard = ( { cls, events } ) => {
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
        >
            <Flex justify="space-between" align="center">
                <Text fontSize="2xl" fontWeight="bold">{cls.abbr}</Text>
            </Flex>
            
            <Text fontSize="lg" fontWeight="semibold" color="#444444" mb={2}>{cls.name}</Text>
            <Text fontSize="lg" color="#666666" mb={4}>{cls.time}</Text>

            <Divider color="black" mb={3} mt={3} /> 

            <Flex mb={2} justify="space-between" align="center">
                <Text fontSize="xl" fontWeight="semibold" color="black">
                    My Office Hours
                </Text>
            </Flex>

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

            {/* For spacing */}
            <Box mb={20}></Box>
            
            {/* Banner at the bottom of the card */}
            <Box position="absolute" bottom="0" left="0" right="0" bg="#BFDCFF" px={4} py={2}>
                <Flex justify="space-between" align="center">
                    <Text color="black">{events ? events.length : 0} office hours</Text>
                    <IconButton
                        icon={<FaRegArrowAltCircleRight size="20" color="black" />}
                        variant="#BFDCFF"
                        onClick={() => navigate("/ta/" + cls.abbr)}
                    />
                </Flex>
            </Box>
        </Box>
    );
};

export default ClassCard;
