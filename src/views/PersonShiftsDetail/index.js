import React from 'react';
import ShiftsCalendar from '../../components/ShiftsCalendar';

const PersonShiftsDetail = () => {
    const events = [
        { title: 'event 1', date: '2021-12-01' },
        { title: 'event 2', date: '2021-12-02' },
        { title: 'event 3', date: '2021-12-03' }
    ];

    return (
        <div className="container-fluid">
            {/* <!-- Main row --> */}
            <div className="row">
                <section className="col-lg-12 connectedSortable">

                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <i className="far fa-calendar-alt mr-1"></i>
                                ตารางเวรของ Person
                            </h3>
                        </div>{/* <!-- /.card-header --> */}
                        <div className="card-body">

                            {/* // TODO: Render fullcalendar */}
                            <ShiftsCalendar events={events} />

                        </div>{/* <!-- /.card-body --> */}
                    </div>{/* <!-- /.card --> */}
                </section>
            </div>{/* <!-- Main row --> */}
        </div>
    )
}

export default PersonShiftsDetail;
