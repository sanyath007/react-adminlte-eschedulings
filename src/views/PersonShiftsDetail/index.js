import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import ShiftsCalendar from '../../components/ShiftsCalendar';

const PersonShiftsDetail = () => {
    const [personShifts, setPersonShifts] = useState(null);
    const [shfitEvents, setShfitEvents] = useState([]);
    const schedule = useSelector(state => state.schedule.schedule);
    const { id } = useParams();

    const generateCalendarEvents = function (month, shiftText) {
        const arrShifts = shiftText.split(',');

        const shfitEvents = arrShifts.map((shift, index) => ({ title: shift, start: moment(`${month}-${index+1}`).format('YYYY-MM-DD') }));

        setShfitEvents(shfitEvents);
    };

    useEffect(() => {
        const ps = schedule.shifts.find(shift => shift.id === parseInt(id));
        
        setPersonShifts(ps);

        generateCalendarEvents(schedule.month, ps.shifts);
    }, []);
    console.log(shfitEvents);
    
    return (
        <div className="container-fluid">
            {/* <!-- Main row --> */}
            <div className="row">
                <section className="col-lg-12 connectedSortable">

                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <i className="far fa-calendar-alt mr-1"></i>
                                ตารางเวรของ {personShifts && personShifts.person.prefix.prefix_name + personShifts.person.person_firstname+ ' ' +personShifts.person.person_lastname}
                            </h3>
                        </div>{/* <!-- /.card-header --> */}
                        <div className="card-body">

                            {/* // TODO: Render fullcalendar */}
                            <ShiftsCalendar events={shfitEvents} />

                        </div>{/* <!-- /.card-body --> */}
                    </div>{/* <!-- /.card --> */}
                </section>
            </div>{/* <!-- Main row --> */}
        </div>
    )
}

export default PersonShiftsDetail;
