import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast
} from "@chakra-ui/react"
import { ClassInput } from "./Input"
import { Form, Formik, useFormikContext } from 'formik';
import { postData } from "../../utils";
import { useRef, useState } from "react";

export const RoomModal = ({ isOpen, onClose, validate }) => {

    const API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/room";
    const toast = useToast();
    const formRef = useRef();
    const [loading, setLoading] = useState(false)

    function createRoom(values, actions) {
        setLoading(true)
        postData(API_URL, values, actions, toast, onExit)
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
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create Room</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Formik
                        innerRef={formRef}
                        initialValues={{}}
                        onSubmit={(values, actions) => createRoom(values, actions)}
                    >
                        {(props) => (
                            <Form>
                                <ClassInput name="classroom_name" validate={validate} label="Classroom Name" placeholder="DL 419" />
                                <ClassInput name="classroom_street" validate={validate} label="Street" placeholder="10 Hillhouse Avenue" />
                                <Flex justify="center" align="center" w="full">
                                    <ClassInput name="classroom_city" validate={validate} label="City" placeholder="New Haven" mr={3} />
                                    <ClassInput name="classroom_state" validate={validate} label="State" placeholder="CT" ml={3} />
                                </Flex>
                                <ClassInput name="classroom_zipcode" validate={validate} label="Zip Code" placeholder="06511" />

                            </Form>
                        )}
                    </Formik>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={submitForm} isLoading={loading}>
                        Create
                    </Button>
                    <Button variant='ghost' onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}