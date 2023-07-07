import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import axios from 'axios';
import * as ICAL from 'ical.js';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function TopShotEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://calendar.google.com/calendar/ical/216d7a8cf62561dc5f14e28914f447896088f0f9eacde4e670b0048faf3211f3%40group.calendar.google.com/public/basic.ics');
        const jcalData = ICAL.parse(response.data);
        const comp = new ICAL.Component(jcalData);
        const eventComps = comp.getAllSubcomponents('vevent');

        const calendarEvents = eventComps.map((eventComp) => {
          const event = new ICAL.Event(eventComp);

          return {
            title: event.summary,
            start: moment(event.startDate.toString()).toDate(),
            end: moment(event.endDate.toString()).toDate(),
            allDay: event.startDate.isDate,
          };
        });
        console.log(calendarEvents);
        setEvents(calendarEvents);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  );
}

export default TopShotEvents;
