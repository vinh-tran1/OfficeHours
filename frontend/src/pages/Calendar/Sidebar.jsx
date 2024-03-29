import React from 'react';
import { Flex, Box, VStack, Heading, IconButton, Text } from '@chakra-ui/react';
import { FaPencilAlt, FaEye } from 'react-icons/fa';

const Sidebar = () => {

    const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

    return (
        <VStack
            ml={4}
            w="20%"
            h="97.5%"
            p={4}
            spacing={4}
            align="stretch"
            bg="#F3F8FF"
            borderRadius={10}
            borderRight="1px"
            borderColor="gray.200"
        >
            <Box bg="#063763" pt={3} pb={3} borderRadius="md">
                <Heading fontSize={26} color="white" textAlign={"center"}>Classes</Heading>
            </Box>
            {/* Example list of classes */}
            {classes.map((className) => (
                <Flex
                    key={className}
                    align="center"
                    justify="space-between"
                    pt={2}
                    pb={2}
                    pl={5}
                    pr={5}
                    bg="white"
                    borderRadius="md"
                    shadow="md"
                >
                    <Text fontSize="md">{className}</Text>
                    <Box>
                        <IconButton
                            aria-label={`Edit ${className}`}
                            icon={<FaPencilAlt />}
                            size="sm"
                            mr={2}
                        />
                        <IconButton
                            aria-label={`View ${className}`}
                            icon={<FaEye />}
                            size="sm"
                        />
                    </Box>
                </Flex>
            ))}
        </VStack>
    );
}

export default Sidebar;