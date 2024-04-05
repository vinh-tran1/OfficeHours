import {
    Flex,
    Text,
    Button,
    Select,
    useToast,
    useDisclosure,
    FormControl,
    FormErrorMessage,
    Input,
    List,
    ListItem,
    IconButton,
    Spacer
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { ClassInput } from '../Input';
import { ClassCheckBox } from '../CheckBox';
import { RoomModal } from '../RoomModal';
import { getData, postData, validate } from '../../../utils';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../../redux/userSlice';

export const ProfessorAddClass = () => {

    const API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/class";
    const ROOM_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/room";
    const GET_ALL_TA_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/tas";

    const userInfo = useSelector(selectUserInfo);
    const user_id = userInfo.user_id;
    const toast = useToast();
    const inputRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const [rooms, setRooms] = useState([])
    const [allTAS, setAllTAS] = useState([]);
    const [taEmail, setTaEmail] = useState('');
    const [selectedTAs, setSelectedTAs] = useState([]);
    const [filteredTAs, setFilteredTAs] = useState([]);

    const submitForm = (values, actions) => {
        const submissionValues = {
            ...values,
            tas: selectedTAs.map(ta => ta.email),
            admin_id: user_id,
        };
        postData(API_URL, submissionValues, actions, toast, () => {
            navigate('/professor/' + values['abbr']);
        });
    }

    useEffect(() => {
        getData(ROOM_API_URL, toast, setRooms)
        const fetchTAs = async () => {
            const tas = await getTAS();
            setAllTAS(tas);
        };
        fetchTAs();
    }, [isOpen])

    // Get all the TAs from the admin table
    async function getTAS() {
        const response = await fetch(GET_ALL_TA_URL)

        if (!response.ok) {
            toast({
                title: response.status,
                status: 'error',
                isClosable: true,
            })
        }

        const tasData = await response.json();
        return tasData.tas;
    }

    const handleAddTAByEmail = () => {
        const foundTA = allTAS.find(ta => ta.email === taEmail);
        if (foundTA) {
            // Prevent adding duplicates
            if (!selectedTAs.some(ta => ta.email === taEmail)) {
                setSelectedTAs(prevTAs => [...prevTAs, foundTA]);
                setTaEmail('');
            } else {
                toast({
                    title: 'TA already added',
                    status: 'warning',
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: 'TA not found',
                status: 'error',
                isClosable: true,
            });
        }
    };

    const handleRemoveTA = (email) => {
        setSelectedTAs(prevTAs => prevTAs.filter(ta => ta.email !== email));
    };
    
    const updateFilteredTAs = (input) => {
        setTaEmail(input);
        const inputLowerCase = input.toLowerCase();
        const filtered = allTAS.filter(ta => (ta.email).toLowerCase().includes(inputLowerCase));
        setFilteredTAs(filtered);
    }

    const handleTASelection = (taEmail) => {
        setTaEmail(taEmail);
        setFilteredTAs([]);

        if (inputRef.current) // brings focus back to input upon click
            inputRef.current.focus();
    }

    return (
        <>
            <Flex px={10} pb={10}>
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
                                            <FormControl isInvalid={form.errors["room"] && form.touched["room"]} mr={6}>
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

                                {/* TA/ULA INFO */}
                                <Text fontSize="2xl" fontWeight="bold" mt={4} opacity="80%" color="#063763" mb={3}>TAs/ULAs</Text>
                                <Flex direction="row" w="full" justifyContent="space-between">
                                    <Flex direction="column" flex="1" mr={4}>
                                        <Input
                                            placeholder='Enter TA/ULA Email'
                                            value={taEmail}
                                            // onChange={(e) => setTaEmail(e.target.value)}
                                            onChange={(e) => updateFilteredTAs(e.target.value)}
                                        />

                                        {/* autocomplete */}
                                        <List spacing={2} maxHeight="200px" borderRadius="md" overflowY="auto" backgroundColor="blue.50">
                                            {filteredTAs && filteredTAs.map((ta, index) => (
                                                <ListItem 
                                                    key={index} p={2} cursor="pointer" _hover={{ bg: '#BFDCFF'}} 
                                                    onClick={() => handleTASelection(ta.email)}
                                                >
                                                    <Flex direction="column">
                                                        <Text fontWeight="semibold">{ta.email}</Text>
                                                        <Text opacity="70%">{ta.name}</Text>  
                                                    </Flex>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Flex>
                                    
                                    <Button colorScheme='blue'
                                        opacity="70%"
                                        type='button'
                                        minWidth={150} onClick={handleAddTAByEmail}>Add TA
                                    </Button>
                                </Flex>

                                <Spacer />

                                <List spacing={4} mt={4}>
                                    {selectedTAs.map(ta => (
                                        <ListItem
                                            key={ta.email}
                                            display="flex"
                                            alignItems="center"
                                            bg="blue.50"
                                            py={2}
                                            px={3}
                                            borderRadius="md"
                                            boxShadow="sm"
                                        >
                                            <Text
                                                flex="1"
                                                fontSize="md"
                                                fontWeight="bold"
                                                color="blue.800"
                                            >
                                                {ta.name} <Text as="span" fontWeight="normal">({ta.email})</Text>
                                            </Text>
                                            <IconButton
                                                aria-label="Delete TA"
                                                icon={<MdDelete size={"1.25em"} />}
                                                color="blue.800"
                                                onClick={() => handleRemoveTA(ta.email)}
                                                variant="ghost"
                                            />
                                        </ListItem>
                                    ))}
                                </List>
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