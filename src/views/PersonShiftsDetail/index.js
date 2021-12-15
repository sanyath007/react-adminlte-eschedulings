import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import ShiftsCalendar from '../../components/ShiftsCalendar';
import ShiftModal from '../Modals/ShiftModal';

const PersonShiftsDetail = () => {
    const { id } = useParams();
    const [personShifts, setPersonShifts] = useState(null);
    const [shfitEvents, setShfitEvents] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const schedule = useSelector(state => state.schedule.schedule);

    const generateCalendarEvents = function (month, shiftText) {
        let shfitEvents = [];
        shiftText.split(',').forEach((shift, index) => {
            let tmp = [];
            shift.split('|').forEach(sh => {
                if (sh !== '') {
                    tmp.push({
                        title: sh,
                        start: moment(`${month}-${index+1}`).format('YYYY-MM-DD'),
                        // allDay: false,
                        display: 'list-item',
                        displayEventTime: false
                    });
                }
            });

            shfitEvents.push(...tmp);
        });

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
            <ShiftModal
                isOpen={openModal}
                hideModal={() => setOpenModal(false)}
            />

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
                            <ShiftsCalendar
                                events={shfitEvents}
                                defaultDate={schedule ? `${schedule.month}-01` : '2021-12-01'}
                                onEventClicked={(arg) => {
                                    setOpenModal(true);

                                    console.log(arg);
                                }}
                            />

                        </div>{/* <!-- /.card-body --> */}
                    </div>{/* <!-- /.card --> */}
                </section>
            </div>{/* <!-- Main row --> */}
        </div>
    )
}

export default PersonShiftsDetail;
