import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // Plugins
import interactionPlugin from "@fullcalendar/interaction";

const ShiftsCalendar = (props) => {
    const handleDateClick = function (arg) {
        console.log('Date click!!', arg);
    };

    const handleEventClick = function (arg) {
        console.log('Event click!!', arg);
    };

    const renderEventContent = function (eventInfo) {
        console.log(eventInfo);

        return (
            <>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </>
        );
    };

    return (
        <FullCalendar
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            dateClick={(date) => handleDateClick(date)}
            eventClick={(date) => handleEventClick(date)}
            eventContent={renderEventContent}
            events={props.events}
        />
    )
}

export default ShiftsCalendar
