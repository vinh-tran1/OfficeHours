import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { Flex } from '@chakra-ui/react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Sidebar from './Sidebar';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: 'Long Event',
    start: new Date(2024, 2, 29, 2), // Remember: Months are 0-indexed in JavaScript Dates
    end: new Date(2024, 2, 29, 4),
  },
  // More events...
];

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

const MyWeekCalendar = () => (
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
);

export default MyWeekCalendar;