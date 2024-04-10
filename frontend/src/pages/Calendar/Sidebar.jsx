import React, { useEffect, useState } from 'react';
import { Flex, Box, VStack, Heading, IconButton, Text, useToast } from '@chakra-ui/react';
import { FaPencilAlt, FaEye } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../redux/userSlice';
import { getData } from '../../utils';
import { Class } from '../../classes/Class';

const Sidebar = ({ toggleHiddenClass }) => {

    const userInfo = useSelector(selectUserInfo);
    const user_id = userInfo.user_id;
    const ADMIN_CLASS_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/admin/class?admin_id=" + user_id;
    const STUDENT_CLASS_API_URL = process.env.REACT_APP_API_URL_LOCAL + '/api/user/' + user_id + '/classes';
    const [classes, setClasses] = useState([]);
    const toast = useToast();

    useEffect(() => {
        getClasses();
    }, [])

    function getClasses() {
        if(userInfo.role === 'Student') {
            // get student classes
            getStudentClasses(STUDENT_CLASS_API_URL);
          } else {
            // get admin classes (professor or TA)
            getAdminClasses(ADMIN_CLASS_API_URL);
          }
    }

    function getAdminClasses(api_url) {
        getData(api_url, toast, (cls) => clsToName(cls));
    }

    function getStudentClasses(api_url) {
        getData(api_url, toast, (cls) => clsToName(cls));
    }
    
    function clsToName(classes) {
        let clss = []
        for(let i in classes) {
            let cls = classes[i]
            if (userInfo.role === 'Student')
                clss.push(new Class(cls.abbr, cls.name, cls.hours, cls.time, cls.room, cls.street, cls.zipcode))
            else
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
                    <Flex direction="row">
                        {/* TODO - NEXT VERSION */}
                        <IconButton
                            aria-label={`View ${cls.name}`}
                            icon={<FaPencilAlt />}
                            size="sm"
                            mr={2}
                            backgroundColor="white"
                        />
                        <IconButton
                            aria-label={`View ${cls.name}`}
                            icon={<FaEye />}
                            size="sm"
                            backgroundColor="white"
                            onClick={() => toggleHiddenClass(cls.abbr)}
                        />
                    </Flex>
                </Flex>
            ))}
        </VStack>
    );
}

export default Sidebar;