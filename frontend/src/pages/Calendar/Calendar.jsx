import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Flex, useToast } from '@chakra-ui/react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Sidebar from './Sidebar';
import { getData } from '../../utils';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../redux/userSlice';
import moment from 'moment'
import 'moment-timezone'
import "../../styles/calendar.css"

import axios from 'axios';
import { MdContactSupport } from 'react-icons/md';

moment.tz.setDefault('America/New_York')
const localizer = momentLocalizer(moment)

const eventStyleGetter = (event, start, end, isSelected) => {
  let style = {
    backgroundColor: '#063763',
    borderRadius: '10px',
    color: 'white',
    width: '100%',
  };
  return {
    style: style,
  };
};

const MyWeekCalendar = () => {

  const userInfo = useSelector(selectUserInfo);
  const user_id = userInfo.user_id;
  const PROFESSOR_EVENTS_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/events/all";
  const STUDENT_EVENTS_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/user/" + user_id + "/events";
  const [events, setEvents] = useState([]);
  const [scrollToTime, setTime] = useState(new Date().setHours(10,0,0,0))
  const toast = useToast();

  useEffect(() => {
    getEvents();
  }, [])

  function getEvents() {
    if(userInfo.role === 'Student') {
      // get student events
      getStudentEvents(STUDENT_EVENTS_API_URL);
    } else {
      // get professor events
      getProfessorEvents(PROFESSOR_EVENTS_API_URL + "?admin_id=" + user_id);
    }
  }

  function getProfessorEvents(api_url) {
    getData(api_url, toast, (events) => cleanEvents(events));
  }

  function getStudentEvents(api_url) {
    getData(api_url, toast, (events) => cleanEvents(events));
  }

  function cleanEvents(evts) {
    let events = []
    for(let i in evts) {
      let e = evts[i]
      const { startDate, endDate } = getDateRangeOfTheWeek(e.time, e.start, e.end);

      let evt = {}
      evt.title = e.name
      evt.start = startDate;
      evt.end = endDate
      events.push(evt)
    }
    setEvents(events)
  }

  function getDateRangeOfTheWeek(dayName, startTime, endTime, referenceDate = new Date()) {
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const targetDayIndex = daysOfWeek.indexOf(dayName.toLowerCase());
    if (targetDayIndex === -1) {
      throw new Error("Invalid day name");
    }

    const currentDayIndex = referenceDate.getDay();
    const difference = targetDayIndex - currentDayIndex;

    const startDate = new Date(referenceDate);
    startDate.setDate(referenceDate.getDate() + difference);

    const [startHours, startMinutes] = startTime.split(':');
    startDate.setHours(parseInt(startHours, 10), parseInt(startMinutes, 10), 0, 0);

    const endDate = new Date(startDate);
    const [endHours, endMinutes] = endTime.split(':');
    endDate.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10), 0, 0);

    if (endDate < startDate) {
      throw new Error("End time must be after start time");
    }

    return { startDate, endDate };
  }
  

  return (
    <Flex
      direction="row"
      justifyContent="flex-start"
      p={4}
      pt={5}
      width="100vw"
      height="calc(100vh - 64px)"
      overflow="hidden"
    >
      <div style={{
        width: '80%',
        height: '97.5%',
        backgroundColor: '#F3F8FF',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          scrollToTime={scrollToTime}
          views={['week']}
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: () => null
          }}
        />
      </div>
      <Sidebar />
    </Flex>
  )
};

export default MyWeekCalendar;