import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    Flex,
    ModalHeader,
    ModalOverlay,
    useToast,
    Text,
    Box
} from "@chakra-ui/react"
import { convertTo12HourFormat } from "../../utils";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export function ClassModal({ isOpen, onClose, cls, toggleHiddenEvent, hidden }) {
    const toast = useToast();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent minW="55%">
                <ModalHeader>
                    <Text fontSize="5xl" fontWeight="bold"  color="#063763">{cls.class && cls.class.abbr}</Text>
                    <Text fontSize="2xl" fontWeight="bold" opacity="80%" color="#063763">{cls.class && cls.class.name}</Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column">
                        <Flex direction="row" justify="space-between" align="top">
                            <Flex direction="column" minW="50%" p={4} h="100%">
                                <Text fontSize="2xl" fontWeight="bold" opacity="80%" color="#063763">Office Hour Times</Text>
                                <Box
                                    borderWidth="2px"
                                    borderRadius="lg"
                                    borderColor="#4073AF"
                                    overflow="hidden"
                                    boxShadow="lg"
                                    bg="#f4f4f4"
                                    position="relative"
                                    flex={1}
                                >
                                    {cls.events !== undefined && cls.events.map((event, index) => (
                                        <Flex key={index} borderBottom={(index === cls.events.length - 1) ? "" : "1px solid gray"} justify="space-between">
                                            <Box p="2">
                                                <Text fontSize="sm" fontWeight="semibold" color="gray">
                                                    {event.time}: {convertTo12HourFormat(event.start) + "-" + convertTo12HourFormat(event.end)} @ {event.location}
                                                </Text>
                                                <Text fontSize="sm" color="gray">
                                                    HOST: {event.admin}
                                                </Text>
                                            </Box>
                                            <Box
                                                cursor="pointer"
                                                fontSize="1.5em"
                                                mt="2"
                                                mr="3"
                                                as={hidden !== undefined && hidden.has(event.id) ? FaEyeSlash : FaEye}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleHiddenEvent(event.id);
                                                }}
                                            />
                                        </Flex>
                                    ))}
                                    {cls.events !== undefined && cls.events.length === 0 && <Box p="2"><Text fontSize="l" fontWeight="semibold" color="gray">No Office hours</Text></Box>}
                                </Box>
                            </Flex>
                            <Flex direction="column" minW="50%" p={4} h="100%">
                                <Text fontSize="2xl" fontWeight="bold" opacity="80%" color="#063763">TAs/ULAs</Text>
                                <Box
                                    borderWidth="2px"
                                    borderRadius="lg"
                                    borderColor="#4073AF"
                                    overflow="hidden"
                                    boxShadow="lg"
                                    bg="#f4f4f4"
                                    position="relative"
                                    flex={1}
                                >
                                    {cls.tas !== undefined && cls.tas.map((ta, index) => (
                                        <Box key={index} borderBottom={(index === cls.tas.length - 1) ? "" : "1px solid"} p="2">
                                            <Text fontSize="l" fontWeight="semibold" color="gray">
                                                {ta.name}
                                            </Text>
                                        </Box>
                                    ))}
                                    {cls.tas !== undefined && cls.tas.length === 0 && <Box p="2"><Text fontSize="l" fontWeight="semibold" color="gray">No TAs</Text></Box>}
                                </Box>
                            </Flex>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}