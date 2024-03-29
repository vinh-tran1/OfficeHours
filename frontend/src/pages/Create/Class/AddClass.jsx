import {
    Flex,
    Text,
    Button,
    Select,
    useToast,
    useDisclosure,
    FormControl,
    FormErrorMessage
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { ClassInput } from '../Input';
import { ClassCheckBox } from '../CheckBox';
import { RoomModal } from '../RoomModal';
import { getData, postData, validate } from '../../../utils';
import { useEffect, useState } from 'react';

export const ProfessorAddClass = () => {

    const API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/class";
    const ROOM_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/room";
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const [rooms, setRooms] = useState([])

    const submitForm = (values, actions) => {
        // TODO
        postData(API_URL, values, actions, toast, () => {navigate('/professor/' + values['abbr']);})
    }

    useEffect(() => {
        getData(ROOM_API_URL, toast, setRooms)
      }, [isOpen])

    return (
        <>
            <Flex px={10}>
                <Flex direction="column" justify="start" align="start" w="full">
                    <Text fontSize="5xl" fontWeight="bold" mt={4} color="#063763">Create Class</Text>
                    <Formik
                        initialValues={{}}
                        onSubmit={(values, actions) => submitForm(values, actions)}
                    >
                        {(props) => (
                            <Form>
                                <Text fontSize="2xl" fontWeight="bold" mt={4} opacity="80%" color="#063763">Class</Text>
                                <ClassInput name='abbr' validate={validate} label='Class Code' placeholder='CPSC 419' />
                                <ClassInput name='name' validate={validate} label='Name' placeholder='Full Stack' />
                                <ClassCheckBox name="time" validate={validate} label="Time" values={days} />
                                <ClassInput name='time-hours' validate={validate} label='' placeholder='1:00pm - 2:15pm' />

                                {/* ROOM INFO */}
                                <Text fontSize="2xl" fontWeight="bold" mt={4} opacity="80%" color="#063763" mb={3}>Room</Text>
                                <Flex justify="center" align="center" w="full">
                                    <Field name="room" validate={(value) => validate("Class Room", value)}>
                                        {({ field, form }) => (
                                            <FormControl isInvalid={form.errors["room"] && form.touched["room"]}  mr={6}>
                                                <Select {...field} placeholder='Select room'>
                                                    {rooms.map((room, index) => <option value={room} key={index}>{room}</option>)}
                                                </Select>
                                                <FormErrorMessage>{form.errors["room"]}</FormErrorMessage>
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
                                    >
                                        Create Room
                                    </Button>
                                </Flex>
                                <br />
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
                </Flex>
            </Flex>
            <RoomModal isOpen={isOpen} onClose={onClose} validate={validate} />
        </>
    )
}