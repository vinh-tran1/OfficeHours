import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Flex, useDisclosure, useToast } from '@chakra-ui/react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Sidebar from './Sidebar';
import { getData } from '../../utils';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../redux/userSlice';
import moment from 'moment'
import 'moment-timezone'
import "../../styles/calendar.css"
import { MdContactSupport } from 'react-icons/md';
import { ClassModal } from './ClassModal';
import { getClassEvents, getClassTAs } from './CalendarUtils';
import CustomEvent from './CustomEvent';

moment.tz.setDefault('America/New_York')
const localizer = momentLocalizer(moment)

const eventStyleGetter = (event, start, end, isSelected) => {
  let style = {
    backgroundColor: event.hexColor,
    borderRadius: '10px',
    color: 'white',
    width: '100%',
    border: "1px solid " + event.hexColor
  };
  return {
    style: style,
  };
};

// TODO - add better colors
const colors = [
  '#063763', '#440663', '#630612',
  '#5d6306', '#9CADCE', '#06631f',
  '#63535B', '#315905', '#ae8c6d'];

const MyWeekCalendar = () => {

  const userInfo = useSelector(selectUserInfo);
  const user_id = userInfo.user_id;
  const PROFESSOR_EVENTS_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/events/all";
  const STUDENT_EVENTS_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/user/" + user_id + "/events";
  const CLASS_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/class/"
  const [cls, setCls] = useState({})
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [scrollToTime, setTime] = useState(new Date().setHours(10, 0, 0, 0))
  const [hiddenClassIds, setHiddenClassIds] = useState(new Set());
  const [hiddenEventIds, setHiddenEventIds] = useState(new Set());

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();


  useEffect(() => {
    getEvents();
  }, [])

  useEffect(() => {
    setEvents(allEvents.filter(event => !hiddenClassIds.has(event.class_id) && !hiddenEventIds.has(event.title)));
  }, [hiddenClassIds, hiddenEventIds, allEvents]);

  function getEvents() {
    if (userInfo.role === 'Student') {
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
    let colorMap = {}
    let colorIndex = 0;

    for (let i in evts) {
      let e = evts[i]
      const { startDate, endDate } = getDateRangeOfTheWeek(e.time, e.start, e.end);
      if (colorMap[e.class_id] === undefined) {
        colorMap[e.class_id] = colorIndex;
        colorIndex = (colorIndex + 1) % colors.length;
      }

      let evt = {}
      evt.title = e.name;
      evt.start = startDate;
      evt.end = endDate;
      evt.hexColor = colors[colorMap[e.class_id]];
      evt.class_id = e.class_id;  // for filtering purposes later on
      evt.location = e.location;
      events.push(evt);
    }
    setEvents(events);
    setAllEvents(events);
  }

  function toggleHiddenClass(class_id) {
    setHiddenClassIds(prevHiddenClassIds => {
      const newHiddenClassIds = new Set(prevHiddenClassIds);
      if (newHiddenClassIds.has(class_id)) {
        newHiddenClassIds.delete(class_id);
      } else {
        newHiddenClassIds.add(class_id);
      }
      return newHiddenClassIds;
    });
  }

  function toggleHiddenEvent(eventId) {
    setHiddenEventIds(prevHiddenEventIds => {
      const newHiddenEventIds = new Set(prevHiddenEventIds);
      if (newHiddenEventIds.has(eventId)) {
        newHiddenEventIds.delete(eventId);
      } else {
        newHiddenEventIds.add(eventId);
      }
      return newHiddenEventIds;
    })
  }

  function showModal(class_id) {
    getData(CLASS_API_URL + class_id, toast, updateModal)
  }

  async function updateModal(class_info) {
    let c = {}
    c.class = class_info;
    c.events = await getClassEvents(c.class.abbr, toast)
    c.tas = await getClassTAs(c.class.abbr, toast);
    setCls(c)
    onOpen()
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

    const eventStyleGetter = (event, start, end, isSelected) => {
      let style = {
        backgroundColor: event.hexColor,
        borderRadius: '10px',
        color: 'white',
        padding: '10px',
        minHeight: '103px',
        border: "1px solid " + event.hexColor
      };
      return {
        style: style,
      };
    };

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
              event: props => <CustomEvent {...props} toggleHiddenEvent={toggleHiddenEvent} />,
              toolbar: () => null
            }}
          />
        </div>
        <Sidebar toggleHiddenClass={toggleHiddenClass} showModal={showModal} />
      <ClassModal isOpen={isOpen} onClose={onClose} cls={cls}  />
      </Flex>
    );
  };

  export default MyWeekCalendar;