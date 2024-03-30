import React, { useEffect, useState } from 'react';
import { Flex, Box, VStack, Heading, IconButton, Text, useToast } from '@chakra-ui/react';
import { FaPencilAlt, FaEye } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../redux/userSlice';
import { getData } from '../../utils';
import { Class } from '../../classes/Class';

const Sidebar = () => {

    const userInfo = useSelector(selectUserInfo);
    const user_id = userInfo.user_id;
    const CLASS_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/professor/class?admin_id=" + user_id;
    const [classes, setClasses] = useState([]);
    const toast = useToast();

    useEffect(() => {
        getData(CLASS_API_URL, toast, (cls) => clsToName(cls))
    }, [])

    function clsToName(classes) {
        let clss = []
        for(let i in classes) {
            let cls = classes[i]
            clss.push(new Class(cls[0], cls[1], cls[2], cls[3], cls[4], cls[5], cls[6]))
        }
        setClasses(clss)
    }

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
            {classes.map((cls) => (
                <Flex
                    key={cls.abbr}
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
                    <Flex direction="column" justify="start" align="start" w="full">
                        <Text fontSize="md" fontWeight="semibold">{cls.abbr}</Text>
                        <Text fontSize="md">{cls.name}</Text>
                    </Flex>
                    <Box>
                        {/* TODO - NEXT VERSION */}
                        {/* <IconButton
                            aria-label={`View ${className}`}
                            icon={<FaEye />}
                            size="sm"
                        /> */}
                    </Box>
                </Flex>
            ))}
        </VStack>
    );
}

export default Sidebar;