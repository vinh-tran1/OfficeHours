import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Flex, useDisclosure, useToast } from '@chakra-ui/react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Sidebar from './Sidebar';
import { getData, postData, updateData } from '../../utils';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../redux/userSlice';
import moment from 'moment'
import 'moment-timezone'
import "../../styles/calendar.css"
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
  const HIDE_ADMIN_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/admin/" + user_id + "/hide/events";
  const HIDE_USER_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/user/" + user_id + "/hide/events";
  const HIDDEN_ADMIN_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/admin/hidden/events";
  const HIDDEN_USER_API_URL = process.env.REACT_APP_API_URL_LOCAL + "/api/user/hidden/events";
  const [cls, setCls] = useState({})
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [adminHiddenEvents, setAdminHiddenEvents] = useState(new Set());
  const [scrollToTime, setTime] = useState(new Date().setHours(10, 0, 0, 0))
  const [hiddenClassIds, setHiddenClassIds] = useState(new Set());
  const [hiddenEventIds, setHiddenEventIds] = useState(new Set());

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();


  useEffect(() => {
    getHiddenEvents();
  }, [])

  useEffect(() => {
    setEvents(allEvents.filter(event => !hiddenEventIds.has(event.id)));
  }, [hiddenEventIds, allEvents]);

  function getEvents(hidden_events) {
    if (userInfo.role === 'Student') {
      // get student events
      getStudentEvents(STUDENT_EVENTS_API_URL, hidden_events);
    } else {
      // get professor events
      getProfessorEvents(PROFESSOR_EVENTS_API_URL + "?admin_id=" + user_id, hidden_events);
    }
  }

  function getHiddenEvents() {
    getData(userInfo.role === 'Student' ? HIDDEN_USER_API_URL + "?user_id=" + user_id : HIDDEN_ADMIN_API_URL  + "?admin_id=" + user_id, toast, (events) => {
      let hidden = new Set()
      for(let i = 0; i < events.length; i++) {
        hidden.add(events[i].id) 
      }
      setHiddenEventIds(hidden);
      getEvents(hidden);
    })
  }

  function getProfessorEvents(api_url, hidden_events) {
    getData(api_url, toast, (events) => cleanEvents(events, hidden_events));
  }

  function getStudentEvents(api_url, hidden_events) {
    getData(api_url, toast, (events) => cleanEvents(events, hidden_events));
  }

  function cleanEvents(evts, hidden) {
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
      evt.id = e.id;
      evt.admin = e.admin;
      evt.title = e.name;
      evt.start = startDate;
      evt.end = endDate;
      evt.hexColor = colors[colorMap[e.class_id]];
      evt.class_id = e.class_id;  // for filtering purposes later on
      evt.location = e.location;
      events.push(evt);
    }
    let filtered_events = events.filter(event => !hidden.has(event.id));
    setEvents(filtered_events);
    setAllEvents(events);
  }

  function toggleHiddenClass(class_id) {
    setHiddenClassIds(prevHiddenClassIds => {
      const newHiddenClassIds = new Set(prevHiddenClassIds);
      let current = newHiddenClassIds.has(class_id);

      if (current) {
        newHiddenClassIds.delete(class_id);
      } else {
        newHiddenClassIds.add(class_id);
      }

      // now have to update events visibility associated with the class
      const newHiddenEventIds = new Set(hiddenEventIds);
      allEvents.forEach(event => {
        if (event.class_id === class_id) {
          if (current) {
            newHiddenEventIds.delete(event.id);
            console.log('delete', event.class_id)
          } else {
            newHiddenEventIds.add(event.id);
            console.log('add', event.class_id)
          }
        }
      });

      console.log('old', hiddenEventIds, 'new', newHiddenEventIds);
      const elements = getUniqueElementsByList(Array.from(hiddenEventIds), Array.from(newHiddenEventIds))

      const values = {
        "added_event_ids": elements.added,
        "deleted_event_ids": elements.deleted
      }
      updateData(userInfo.role === 'Student' ? HIDE_USER_API_URL : HIDE_ADMIN_API_URL, "POST", values, toast, () => {})
      setHiddenEventIds(newHiddenEventIds);

      return newHiddenClassIds;
    });
  }

  function toggleHiddenEvent(eventId) {
    setHiddenEventIds(prevHiddenEventIds => {
      const newHiddenEventIds = new Set(prevHiddenEventIds);
      if (newHiddenEventIds.has(eventId)) {
        newHiddenEventIds.delete(eventId);
        updateData(userInfo.role === 'Student' ? HIDE_USER_API_URL : HIDE_ADMIN_API_URL, "POST", {"deleted_event_ids": [eventId]}, toast, () => {})
      } else {
        newHiddenEventIds.add(eventId);
        updateData(userInfo.role === 'Student' ? HIDE_USER_API_URL : HIDE_ADMIN_API_URL, "POST", {"added_event_ids": [eventId]}, toast, () => {})
      }
      return newHiddenEventIds;
    })
  }

  function getUniqueElementsByList(list1, list2) {
    const deleted = list1.filter(item => !list2.includes(item));
    const added = list2.filter(item => !list1.includes(item));
    console.log('deleted', deleted, 'added', added)
    return {
      deleted,
      added
    };
  }

  function showModal(class_id) {
    getData(CLASS_API_URL + class_id, toast, updateModal)
  }

  async function updateModal(class_info) {
    let c = {}
    c.class = class_info;
    c.events = await getClassEvents(c.class.abbr, toast);
    c.tas = await getClassTAs(c.class.abbr, toast);
    setCls(c);

    if (userInfo.role !== 'Student') {
      setAdminHiddenEvents(prevHiddenEventIds => {
        const newHiddenEventIds = new Set(prevHiddenEventIds);
        c.events.forEach(evt => {
          
            if (evt.admin !== userInfo.name) {
              newHiddenEventIds.add(evt.id);
            }
            else {
              newHiddenEventIds.delete(evt.id);
            }
        });
        return newHiddenEventIds;
      });
    }

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
        <Sidebar toggleHiddenClass={toggleHiddenClass} showModal={showModal} hiddenEvents={hiddenEventIds} allEvents={allEvents}/>
        <ClassModal isOpen={isOpen} onClose={onClose} cls={cls} toggleHiddenEvent={toggleHiddenEvent} hidden={hiddenEventIds} hiddenAdminEvents={adminHiddenEvents}/>
      </Flex>
    );
  };

  export default MyWeekCalendar;