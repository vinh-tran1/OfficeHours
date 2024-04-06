import React, { useState, useEffect } from "react";
import { Box, Flex, Text, IconButton, Divider, useToast, Spinner } from "@chakra-ui/react";
import { FaEdit, FaRegArrowAltCircleRight, FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { convertTo12HourFormat } from "../../../utils";

const ClassCard = ({ cls, events, ta, deleteClass, update }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/events";
  const [taInfoWithEventsLength, setTaInfoWithEventsLength] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getEvents() {
      setIsLoading(true);
      const taInfoWithEvents = [];
      for (let i = 0; i < ta.length; i++) {
        const taEvents = await getTAEvents(ta[i].id);
        taInfoWithEvents.push({
          taInfo: ta[i],
          eventsLength: taEvents.length
        });
      }
      setTaInfoWithEventsLength(taInfoWithEvents);
      setIsLoading(false);
    }
    if (ta.length > 0) {
      getEvents();
    }
  }, [ta, events]);

  const handleRemoveClass = () => {
    deleteClass(cls.abbr)
  }
  const handleUpdateClass = () => {
    update(cls)
  }

  async function getTAEvents(admin_id) {
    const response = await fetch(API_URL + "?admin_id=" + admin_id + "&class_id=" + cls.abbr)

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
    <Box
      borderWidth="2px"
      borderRadius="lg"
      borderColor="#4073AF"
      overflow="hidden"
      p={4}
      boxShadow="lg"
      bg="#f4f4f4"
      position="relative"
    >
      {/* Class info */}
      <Flex justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          {cls.abbr}
        </Text>
        <Box>
          {/* TODO - UPDATE */}
          <IconButton
            icon={<FaEdit size="20" color="black" />}
            variant="ghost"
            onClick={handleUpdateClass} />
          <IconButton
            icon={<FaTrash size="20" color="black" />}
            variant="ghost"
            onClick={handleRemoveClass} />
        </Box>

      </Flex>
      <Text fontSize="l" fontWeight="semibold" color="gray">
        {cls.name}
      </Text>
      <Text fontSize="l" color="gray">
        Location: {cls.room_abbr}
      </Text>

      <Divider color="black" mb={3} mt={3} />

      {/* Professor OH Info */}
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="semibold" color="black">
          My Office Hours
        </Text>
      </Flex>
      {events !== undefined && events.map((event, index) => (
        <Box key={index} mb={2}>
          <Text fontSize="l" fontWeight="semibold" color="gray">
            {event.time}:
          </Text>
          <Text fontSize="l" color="gray">
            {convertTo12HourFormat(event.start) + "-" + convertTo12HourFormat(event.end)}
          </Text>
        </Box>
      ))}

      {events !== undefined && events.length === 0 && <Text mt={2} fontSize="l" fontWeight="semibold" color="gray">No Office Hours</Text>}

      <Divider color="black" mb={3} mt={3} />
      <Flex mb={2} justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="semibold" color="black">
          My TAs/ULAs
        </Text>
      </Flex>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {ta !== undefined && ta.length > 0 ? taInfoWithEventsLength.map((info, index) => (
            <Box mb={2} key={index}>
              <Text fontSize="l" fontWeight="semibold" color="black">
                {info.taInfo.name}
              </Text>
              <Text fontSize="l" fontWeight="semibold" color="gray">
                Office hours: {info.eventsLength}
              </Text>
            </Box>
          ))
          :
          <Text>None Assigned</Text>
          }
        </>
      )}

      {/* For spacing */}
      <Box mb={20}></Box>

      {/* Banner at the bottom of the card */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        bg="#BFDCFF"
        px={4}
        py={3}
      >
        <Flex justify="space-between" align="center">
          <Text color="black">{cls.hours} office hours</Text>
          <IconButton
            icon={<FaRegArrowAltCircleRight size="20" color="black" />}
            variant="#BFDCFF"
            onClick={() => navigate("/professor/" + cls.abbr)}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default ClassCard;