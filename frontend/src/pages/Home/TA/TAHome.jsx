import React, { useEffect, useState } from 'react';
import {
  Flex,
  Grid,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useSelector } from 'react-redux';
import { getData } from '../../../utils';
import { Class } from '../../../classes/Class';
import { selectUserInfo } from '../../../redux/userSlice';
import ClassCard from './ClassCard';

const TAHome = () => {
    const userInfo = useSelector(selectUserInfo);
    const user_id = userInfo.user_id;
    const toast = useToast();
    const CLASS_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/admin/class?admin_id=" + user_id;
    const EVENT_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/events?admin_id=" + user_id;
    
    const [isLoading, setLoading] = useState(true);
    const [classes, setClasses] = useState([])


    useEffect(() => {
        getData(CLASS_API_URL, toast, updateClasses);
    }, []);

    async function updateClasses(class_infos) {
        let clses = []
        for (let i in class_infos) {
          let cls_info = class_infos[i]
          let cls = {}
          cls.class = new Class(cls_info[0], cls_info[1], cls_info[2], cls_info[3], cls_info[4], cls_info[5], cls_info[6]);
          cls.events = await getEvents(cls.class.abbr)
          clses.push(cls)
        }
        setClasses(clses);
        setLoading(false);
      }

      async function getEvents(class_id) {
        const response = await fetch(EVENT_API_URL + "&class_id=" + class_id)
    
        if (!response.ok) {
          toast({
            title: response.status,
            status: 'error',
            isClosable: true,
          })
        }
    
        const events = await response.json()
        return events['response']
      }

    return (
        <Flex px={10}>
            <Flex direction="column" justify="start" align="start" w="full">
                <Text fontSize="5xl" fontWeight="bold" mt={4} color="#063763">My Classes</Text>
                <Text fontSize="2xl" fontWeight="bold" opacity="80%" color="#063763" mt={0} mb={6}>({userInfo.role}) {userInfo.name}</Text>
                <Text fontSize="4xl" fontWeight="bold" color="#063763" mb={8}>Spring 2024</Text>

                {/* grid of classes */}
                <Flex direction={{ base: 'column', lg: 'row' }} w="full">
                    <Grid templateColumns="repeat(4, 1fr)" gap={10} w="full" mb={6} flex="4">
                        
                        {isLoading ? (
                            <Spinner />
                        ) : ( classes.length === 0 ? (
                                <Flex direction="column" w="full" flex="3">
                                    <Text fontSize={20} textColor="#063763">No classes to TA yet...</Text>
                                    <Text fontSize={16} mt={2} textColor="#666666">Contact the professor for more information</Text>
                                </Flex>
                            ) : (classes.map((cls, index) => (
                                    <ClassCard key={index} cls={cls.class} events={cls.events}/>
                                )))
                            )
                        }
                    </Grid>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default TAHome;