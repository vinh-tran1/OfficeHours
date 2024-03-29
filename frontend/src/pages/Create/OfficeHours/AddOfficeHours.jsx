import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Select,
    Text,
    VStack,
    useDisclosure,
    useToast,
  } from '@chakra-ui/react';
import { ClassRadio } from "../Radio"
import { ClassInput } from '../Input';
import { getData, validate } from '../../../utils';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { RoomModal } from '../RoomModal';

export const AddOfficeHours = ({class_name, createEvent}) => {
    const ROOM_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/room";
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const [rooms, setRooms] = useState([])
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        getData(ROOM_API_URL, toast, setRooms)
      }, [isOpen])

    return (
        <>
        <Box
            p={4}
            ml={{ lg: 10 }}
            mt={{ base: 6, lg: 0 }}
            borderWidth="2px"
            borderRadius="lg"
            borderColor="#4073AF"
            w={{ base: 'full', lg: 'sm' }}
            mb={10}
            bg="#F3F8FF"
            boxShadow="lg"
            flex="1"
            maxWidth={500}
        >
            <VStack align="stretch">
                <Text fontSize="2xl" fontWeight="bold" mb={2}>Add OH</Text>
                <Formik
                    initialValues={{class: class_name}}
                    onSubmit={(values, actions) => createEvent(values, actions)}
                >
                    {(props) => (
                        <Form>
                            <ClassInput name="name" validate={validate} label="OH Name" placeholder="My Monday OH" inputStyle={{background: "white"}} />
                            <Field name="location" validate={(value) => validate("Class Room", value)}>
                                {({ field, form }) => (
                                    <FormControl isInvalid={form.errors["location"] && form.touched["location"]}  mr={6} mt={2}>
                                        <FormLabel>Location</FormLabel>
                                        <Select {...field} placeholder='Select room' bg="white">
                                            {rooms.map((room, index) => <option value={room} key={index}>{room}</option>)}
                                        </Select>
                                        <FormErrorMessage>{form.errors["location"]}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Button
                                colorScheme='blue'
                                opacity="70%"
                                isLoading={props.isSubmitting}
                                type='button'
                                minWidth={150}
                                onClick={onOpen}
                                mt={2}
                            >
                                Create Room
                            </Button>
                            <ClassRadio name="time" validate={validate} label="Time" values={days} mb={3} />
                            <Flex justify="center" align="center" w="full">
                                <ClassInput name="start" validate={validate} label="Start Time" placeholder="1:00pm" mr={3} inputStyle={{background: "white"}} type="time"  />
                                <ClassInput name="end" validate={validate} label="End Time" placeholder="2:15pm" ml={3} inputStyle={{background: "white"}} type="time" />
                            </Flex>
                            <Button
                                mt={6}
                                colorScheme='blue'
                                isLoading={props.isSubmitting}
                                type='submit'
                                minWidth={300}
                            >
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>
            </VStack>
        </Box>
        <RoomModal isOpen={isOpen} onClose={onClose} validate={validate} />
        </>
    )
}