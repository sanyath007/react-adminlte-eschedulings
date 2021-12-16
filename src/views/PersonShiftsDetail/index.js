import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import ShiftsCalendar from '../../components/ShiftsCalendar';
import ShiftModal from '../Modals/ShiftModal';
import { getScheduleDetailsById } from '../../features/scheduleDetails';

const PersonShiftsDetail = () => {
    const [personShifts, setPersonShifts] = useState(null);
    const [shfitEvents, setShfitEvents] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [shift, setshift] = useState('');

    const { id } = useParams();
    const history = useHistory();
    const scheduleDetails = useSelector(state => getScheduleDetailsById(state, id));

    const getEventBgColor = function (shift) {
        let bgColor = '';
        if (['ด','ด*','ด**','ด^'].includes(shift)) {
            bgColor = '#2BBBD8';
        } else if (['ช','ช*','ช**','ช^'].includes(shift)) {
            bgColor = '#00a03e';
        } else if (['บ','บ*','บ**','บ^'].includes(shift)) {
            bgColor = '#F71E35';
        } else if (['B','B*','B**','B^'].includes(shift)) {
            bgColor = '#FFE869';
        } else {
            bgColor = '#DCDDD8';
        }

        return bgColor;
    };

    const generateCalendarEvents = function (month, shiftId, shiftText) {
        let shfitEvents = [];
        shiftText.split(',').forEach((shift, index) => {
            let calendarEvents = [];
            shift.split('|').forEach(sh => {
                /** Create each calendar event from each shift */
                if (sh !== '') {
                    calendarEvents.push({
                        title: sh,
                        start: moment(`${month}-${index+1}`).format('YYYY-MM-DD'),
                        // allDay: false,
                        display: 'list-item',
                        displayEventTime: false,
                        extendedProps: {
                            shiftId: shiftId,
                            shiftDate: moment(`${month}-${index+1}`).format('YYYY-MM-DD'),
                            shiftText: sh
                        },
                        backgroundColor: getEventBgColor(sh)
                    });
                }
            });

            shfitEvents.push(...calendarEvents);
        });

        setShfitEvents(shfitEvents);
    };

    useEffect(() => {
        /** To redirect to /schedules/list if schedule is null */
        if (!scheduleDetails) {
            history.push('/schedules/list');
        }

        setPersonShifts(scheduleDetails);

        generateCalendarEvents(scheduleDetails.scheduling.month, scheduleDetails.id, scheduleDetails.shifts);
    }, []);
    
    return (
        <div className="container-fluid">

            <ShiftModal
                isOpen={openModal}
                hideModal={() => setOpenModal(false)}
                personShifts={personShifts}
                shift={shift}
            />

            {/* <!-- Main row --> */}
            <div className="row">
                <section className="col-lg-12 connectedSortable">

                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <i className="far fa-calendar-alt mr-1"></i>
                                {/* ตารางเวรของ {personShifts && personShifts.person.prefix.prefix_name + personShifts.person.person_firstname+ ' ' +personShifts.person.person_lastname} */}
                            </h3>
                        </div>{/* <!-- /.card-header --> */}
                        <div className="card-body">

                            {/* Render component of fullcalendar */}
                            <ShiftsCalendar
                                events={shfitEvents}
                                defaultDate={scheduleDetails ? `${scheduleDetails.scheduling.month}-01` : '2021-12-01'}
                                onEventClicked={(arg) => {
                                    setOpenModal(true);

                                    setshift(arg.event?.extendedProps)
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
