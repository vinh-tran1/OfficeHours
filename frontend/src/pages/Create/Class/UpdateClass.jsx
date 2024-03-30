import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast
} from "@chakra-ui/react"
import { ClassInput } from "../Input"
import { Form, Formik } from 'formik';
import { updateData } from "../../../utils";
import { useRef, useState } from "react";
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../../redux/userSlice';
import { ClassCheckBox } from "../CheckBox";

export const ClassModal = ({ isOpen, onClose, validate, cls }) => {

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const userInfo = useSelector(selectUserInfo);
    const user_id = userInfo.user_id;
    const API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/class/";
    const toast = useToast();
    const formRef = useRef();
    const [loading, setLoading] = useState(false)

    function updateClass(values, actions) {
        setLoading(true)
        values.admin_id = user_id
        updateData(API_URL + cls.abbr, "PUT", values, toast, onExit)
    }

    function onExit() {
        setLoading(false)
        onClose()
    }

    const submitForm = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
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
                        initialValues={{"name": cls.name, "time-hours": cls.time !== undefined && cls.time.substring(cls.time.indexOf(" ") + 1)}}
                        onSubmit={(values, actions) => updateClass(values, actions)}
                    >
                        {(props) => (
                            <Form>
                                <ClassInput name='name' validate={validate} label='Name' placeholder='Full Stack' />
                                <ClassCheckBox name="time" validate={validate} label="Time" values={days} />
                                <ClassInput name='time-hours' validate={validate} label='' placeholder='1:00pm - 2:15pm' />

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