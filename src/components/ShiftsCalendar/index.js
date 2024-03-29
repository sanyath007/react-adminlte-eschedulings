import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // Plugins
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import thLocale from '@fullcalendar/core/locales/th';
import moment from 'moment';

const ShiftsCalendar = (props) => {
    const calendarRef = useRef(null);

    const handleDateClick = function (arg) {
        console.log('Date click!!', arg);
    };

    const handleEventClick = function (arg) {
        console.log('Event click!!', arg);

        /** Pass event data to its parant */
        props.onEventClicked(arg);
    };

    const handleMonthChange = function (arg) {
        console.log('Month change!!', arg);
    };

    // const renderEventContent = function (eventInfo) {
    //     console.log(eventInfo);

    //     return (
    //         <>
    //             <b>{eventInfo.timeText}</b>
    //             <i>{eventInfo.event.title}</i>
    //         </>
    //     );
    // };

    return (
        <FullCalendar
            initialView="dayGridMonth"
            initialDate={moment(props.defaultDate).toDate()}
            dateClick={(date) => handleDateClick(date)}
            eventClick={(arg) => handleEventClick(arg)}
            datesSet={(arg) => handleMonthChange(arg)}
            // eventContent={renderEventContent}
            events={props.events}
            locale={thLocale}
            height={'auto'}
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
            ref={calendarRef}
        />
    )
}

export default ShiftsCalendar
