import React, { useEffect, useState } from 'react';
import {
  Flex,
  Grid,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import ClassCard from './ClassCard';
import AddCard from './AddCard';
import { updateData, getData, validate } from '../../../utils';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../../redux/userSlice';
import { Class } from '../../../classes/Class';
import { ClassModal } from '../../Create/Class/UpdateClass';

const ProfessorHome = () => {

  const userInfo = useSelector(selectUserInfo);
  const user_id = userInfo.user_id;
  const CLASS_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/admin/class?admin_id=" + user_id;
  const EVENT_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/events?admin_id=" + user_id;
  const DELETE_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/class/";
  const TAS_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/class/";
  const [isLoading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [modalClass, setModalClass] = useState({})
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    getData(CLASS_API_URL, toast, updateClasses)
  }, [isOpen])

  async function updateClasses(class_infos) {
    let clses = []
    for (let i in class_infos) {
      let cls_info = class_infos[i]
      let cls = {}
      cls.class = new Class(cls_info[0], cls_info[1], cls_info[2], cls_info[3], cls_info[4], cls_info[5], cls_info[6]);
      cls.events = await getEvents(cls.class.abbr)
      cls.ta = await getTAS(cls.class.abbr);
      clses.push(cls)
    }
    setClasses(clses)
    setLoading(false)
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

  function deleteClass(class_id) {
    updateData(DELETE_API_URL + class_id, "DELETE", { "admin_id": user_id }, toast, (response) => deleteSuccess(class_id, response))
  }

  function deleteSuccess(class_id, response) {
    const updatedClasses = classes.filter(classItem => classItem.class.abbr !== class_id);
    setClasses(updatedClasses);
    toast({ title: response, status: "success", isClosable: true, })
  }

  function openModal(cls) {
    setModalClass(cls)
    onOpen()
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
            {isLoading && <Spinner />}
            {classes.map((cls, index) => (
              <ClassCard key={index} cls={cls.class} events={cls.events} ta={cls.ta} deleteClass={deleteClass} update={(c) => openModal(c)} />
            ))}
            <AddCard />
          </Grid>
        </Flex>
      </Flex>
      <ClassModal isOpen={isOpen} onClose={onClose} validate={validate} cls={modalClass} />
    </Flex>
  );
};

export default ProfessorHome;