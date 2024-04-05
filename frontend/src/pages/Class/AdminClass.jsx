import { Text, useToast, Flex, Box, Spinner, Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateData, getData, postData } from "../../utils";
import { OfficeHoursCard } from "./OfficeHours";
import { AddOfficeHours } from "../Create/OfficeHours/AddOfficeHours";
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../redux/userSlice';

export const AdminClass = () => {
    const { id } = useParams();
    const userInfo = useSelector(selectUserInfo);
    const user_id = userInfo.user_id;
    const toast = useToast();
    const API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api";
    const DELETE_API_URL = API_URL + "/events/"
    const EVENT_API_URL = API_URL + "/events?admin_id=" + user_id + "&class_id=" + id;
    const [class_info, setClass] = useState(undefined)
    const [error, setError] = useState(undefined);
    const [eventError, setEventError] = useState(undefined);
    const [events, setEvents] = useState(undefined)

    useEffect(() => {
        getData(API_URL +  "/class/" + id, toast, setClass, setError)
        getData(EVENT_API_URL, toast, setEvents, setEventError) 
      }, [])

    function createEvent(values, actions) {
        values.admin_id = user_id;
        values.class_id = id;
        postData(API_URL + "/events", values, actions, toast, () => {getData(EVENT_API_URL, toast, setEvents, setEventError)});
    }

    function deleteEvent(event_id) {
        updateData(DELETE_API_URL + event_id, "DELETE", { "admin_id": user_id }, toast, (response) => deleteSuccess(event_id, response))
    }

    function deleteSuccess(event_id, response) {
        const updateEvents = events.filter(eventItem => eventItem.id !== event_id);
        setEvents(updateEvents);
        toast({ title: response, status: "success", isClosable: true, })
    }

    return (
        error !== undefined ?
            <Box cursor="pointer" position="fixed" top="50%" left="0" right="0" ml="auto" mr="auto" transform="translateY(-50%)" textAlign="center" px={4} py={3}>
                <Text>{error}</Text>
            </Box>  
        : (
            class_info === undefined ?
                <Box cursor="pointer" position="fixed" top="50%" left="0" right="0" ml="auto" mr="auto" transform="translateY(-50%)" textAlign="center" px={4} py={3}>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Box>
            :
            <>
                <Flex px={10}>
                    <Flex direction="column" justify="start" align="start" w="full">
                        <Text fontSize="5xl" fontWeight="bold" mt={4} color="#063763">{class_info.name}</Text>
                        <Text fontSize="2xl" fontWeight="bold" opacity="80%" color="#063763">{class_info.abbr}</Text>

                        <Flex justify="space-between" align="start" w="full" mt={6}>
                            <Box w="full">
                                <Text fontSize="4xl" fontWeight="bold" color="#063763">Office Hours</Text>
                                
                                {events === undefined ? 
                                    <Spinner
                                        thickness='4px'
                                        speed='0.65s'
                                        emptyColor='gray.200'
                                        color='blue.500'
                                        size='xl'
                                    />
                                : (
                                    events.length > 0 ?
                                        <Grid templateColumns="repeat(3, 1fr)" gap={10} w="full" mt={6} mb={10} flex="3">
                                            {events.map((event, index) => <OfficeHoursCard key={index} id={event.id} start={event.start} location={event.location} time={event.time} end={event.end} deleteEvent={deleteEvent} />)}
                                        </Grid>
                                    :
                                        <Text fontSize="2xl" fontWeight="semibold" mt={6} opacity="80%" color="red">No Office Hours</Text>
                                )
                                }
                            </Box>
                            <AddOfficeHours class={class_info.abbr} createEvent={createEvent} />
                        </Flex>
                    </Flex>
                </Flex>
            </>
        )
    )
}