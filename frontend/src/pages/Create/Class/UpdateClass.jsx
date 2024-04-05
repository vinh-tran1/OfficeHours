import {
    Button,
    Flex,
    IconButton,
    Box,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast,
    Input,
    List,
    ListItem,
    Text,
    Tag,
    TagLabel,
    TagCloseButton
} from "@chakra-ui/react"
import { MdAdd } from "react-icons/md";
import { ClassInput } from "../Input"
import { Form, Formik } from 'formik';
import { updateData } from "../../../utils";
import { useRef, useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../../redux/userSlice';
import { ClassCheckBox } from "../CheckBox";

export const ClassModal = ({ isOpen, onClose, validate, cls }) => {

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const userInfo = useSelector(selectUserInfo);
    const user_id = userInfo.user_id;
    const API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/class/";
    const GET_ALL_TA_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/tas";
    const TAS_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/class/";
    const toast = useToast();
    const formRef = useRef();
    const [loading, setLoading] = useState(true)
    const [initialTAs, setInitialTas] = useState([]);
    const [currentTAs, setCurrentTAs] = useState([]);
    const [availableTAs, setAvailableTAs] = useState([]);
    const [taEmail, setTaEmail] = useState('');

    useEffect(() => {
        if (isOpen && cls.abbr) {
            const fetchTAData = async () => {
                const all_tas = await getAllTAS();
                const tas = await getTAS(cls.abbr);
                setAvailableTAs(all_tas);
                setCurrentTAs(tas);
                setInitialTas(tas);
                setLoading(false)
            };
            fetchTAData();
        }
    }, [isOpen, cls.abbr]);

    // Get all the TAs from the admin table
    async function getAllTAS() {
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

    // get TAs for this specific class
    async function getTAS(class_id) {
        const response = await fetch(TAS_API_URL + class_id + "/tas")
    
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

    function updateClass(values, actions) {

        setLoading(true);
        values.admin_id = user_id;

        const addedTAs = currentTAs.filter(cta =>
            !initialTAs.some(ita => ita.email === cta.email));

        const removedTAs = initialTAs.filter(ita =>
            !currentTAs.some(cta => cta.email === ita.email));

        if (addedTAs.length > 0) {
            values.addedTAs = addedTAs.map(ta => ta.email);
        }
        if (removedTAs.length > 0) {
            values.removedTAs = removedTAs.map(ta => ta.email);
        }

        updateData(API_URL + cls.abbr, "PUT", values, toast, onExit);
    }

    function onExit() {
        setTaEmail('');
        setInitialTas([]);
        setCurrentTAs([]);
        setLoading(false)
        onClose()
    }

    const submitForm = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    const handleAddTAByEmail = () => {
        const foundTA = availableTAs.find(ta => ta.email === taEmail);
        if (foundTA) {
            // Prevent adding duplicates
            if (!currentTAs.some(ta => ta.email === taEmail)) {
                setCurrentTAs(prevTAs => [...prevTAs, foundTA]);
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
        setCurrentTAs(prevTAs => prevTAs.filter(ta => ta.email !== email));
    };

    return (
        <Modal isOpen={isOpen} onClose={onExit}>
            <ModalOverlay />
            <ModalContent minW={560}>
                <ModalHeader>Update {cls.abbr}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Formik
                        innerRef={formRef}
                        initialValues={{ "name": cls.name, "time-hours": cls.time !== undefined && cls.time.substring(cls.time.indexOf(" ") + 1) }}
                        onSubmit={(values, actions) => updateClass(values, actions)}
                    >
                        {(props) => (
                            <Form>
                                <ClassInput name='name' validate={validate} label='Name' placeholder='Full Stack' />
                                <ClassCheckBox name="time" validate={validate} label="Time" values={days} />
                                <ClassInput name='time-hours' validate={validate} label='' placeholder='1:00pm - 2:15pm' />
                                <Text mt={6} fontWeight={500} fontSize="md">Teaching Assistants</Text>
                                <Flex mt={4}>
                                    <Input
                                        placeholder='Enter TA/ULA Email'
                                        value={taEmail}
                                        onChange={(e) => setTaEmail(e.target.value)}
                                        mr={3}
                                    />
                                    <IconButton
                                        colorScheme="blue"
                                        aria-label="Add TA"
                                        icon={<MdAdd />}
                                        onClick={handleAddTAByEmail}
                                    />
                                </Flex>
                                <Box mt={4}>
                                    {currentTAs.length > 0 ? (
                                        <List spacing={2}>
                                            {currentTAs.map(ta => (
                                                <ListItem key={ta.email} display="flex" alignItems="center">
                                                    <Tag size="lg" borderRadius="full" variant="solid" colorScheme="blue" mr={3}>
                                                        <TagLabel>{ta.name} ({ta.email})</TagLabel>
                                                        <TagCloseButton onClick={() => handleRemoveTA(ta.email)} />
                                                    </Tag>
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Text color="gray.500">No teaching assistants added yet.</Text>
                                    )}
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={submitForm} isLoading={loading}>
                        Update
                    </Button>
                    <Button variant='ghost' onClick={onExit}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}