import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { getAllSchedules } from '../../features/schedules';
import { getScheduleDetailsById } from '../../features/scheduleDetails';
import DelegateShifts from './DelegateShifts';

const ShiftSwappingForm = () => {
    const [schedule, setSchedule] = useState([]);
    const [personsOfSchedule, setPersonsOfSchedule] = useState([]);
    const [shiftsOfPerson, setShiftsOfPerson] = useState([]);

    const { id, date, shift: shiftText } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const scheduleDetails = useSelector(state => getScheduleDetailsById(state, id));
    const schedules = useSelector(getAllSchedules);

    useEffect(() => {
        if (!scheduleDetails) {
            history.push('/schedules/list')
        } else {
            const schedule = schedules.find(schedule => schedule.id === parseInt(scheduleDetails.scheduling_id));
            const persons = schedule.shifts
                                .filter(shift => shift.person_id !== scheduleDetails.person_id)
                                .map(shift => shift.person);

            setSchedule(schedule);
            setPersonsOfSchedule(persons);
        }
    }, []);

    const onSelectedDelegate = function (personId) {
        setShiftsOfPerson(schedule.shifts.find(shift => shift.person_id === personId));
    };

    const onSubmit = function (values, props) {
        console.log(values);
    };

    const handleOnSelectedShift = function (formik, date, shift) {
        formik.setFieldValue('represent_date', moment(date).format('YYYY-MM-DD'))
        formik.setFieldValue('represent_shift', shift)
    };

    return (
        <div className="container-fluid">
            {/* <!-- Main row --> */}
            <div className="row">
                <section className="col-lg-12 connectedSortable">

                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <i className="far fa-calendar-alt mr-1"></i>
                                การเปลี่ยนเวร
                            </h3>
                        </div>{/* <!-- /.card-header --> */}
                        <div className="card-body">

                            {/* Render swapping form component */}
                            <Formik
                                enableReinitialize={scheduleDetails}
                                initialValues={{
                                    schedule_detail_id: scheduleDetails ? scheduleDetails.id : '',
                                    owner:  scheduleDetails ? scheduleDetails.person : '',
                                    delegate: '',
                                    reason: '',
                                    old_shift: '',
                                    old_date: '',
                                    represent_shift: '',
                                    represent_date: ''
                                }}
                                onSubmit={onSubmit}
                            >
                                {(formik) => {
                                    return (
                                        <Form>
                                            <Row>
                                                <Col>
                                                    <span className='my-1'>
                                                        <span className='mr-1' style={{ fontWeight: 'bold' }}>ข้าพเจ้า</span> 
                                                        {scheduleDetails && 
                                                            scheduleDetails.person.prefix.prefix_name+scheduleDetails.person.person_firstname+ '' +scheduleDetails.person.person_lastname
                                                        }
                                                    </span>
                                                    <span className='my-1 ml-2'>
                                                        <span className='mr-1' style={{ fontWeight: 'bold' }}>ตำแหน่ง</span>
                                                        {scheduleDetails && 
                                                            scheduleDetails.person.position.position_name
                                                        }
                                                    </span>
                                                    <div>
                                                        <span className='my-1'>
                                                            ขออนุญาตเปลี่ยน <span className='mr-1'>เวร</span>
                                                            {shiftText}
                                                        </span>
                                                        <span className='my-1 ml-2'>
                                                            <span className='mr-1'>ของวันที่</span>
                                                            {date}
                                                        </span>
                                                    </div>
                                                    <div className='my-1'>
                                                        <div className="form-group">
                                                            <label htmlFor="reason">เหตุผลที่ขอเปลี่ยนเวร</label>
                                                            <textarea
                                                                name="reason"
                                                                className='form-control'
                                                                value={formik.values.reason}
                                                                onChange={formik.handleChange}
                                                            ></textarea>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="delegate">โดยมอบหมายให้</label>
                                                            <select
                                                                name="delegate"
                                                                className='form-control'
                                                                value={formik.values.delegate}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue('delegate', e.target.value);
                                                                    onSelectedDelegate(e.target.value);
                                                                }}
                                                            >
                                                                <option value="">-- เลือกผู้ปฏิบัติงานแทน --</option>
                                                                {personsOfSchedule && personsOfSchedule.map(person => {
                                                                    return (
                                                                        <option key={person.person_id} value={person.person_id}>
                                                                            {person.prefix.prefix_name+person.person_firstname+ ' ' +person.person_lastname+ ' '}
                                                                            {person.position.position_name}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="delegate">โดยข้าพเจ้าจะขึ้นปฏิบัติงานแทนในวันที่</label>

                                                            {/* TODO: Render delegate's shifts list */}
                                                            {formik.values.delegate && (
                                                                <div className="card">
                                                                    <div className="card-body">
                                                                        
                                                                        <DelegateShifts
                                                                            schedule={schedule}
                                                                            shiftsOfPerson={shiftsOfPerson}
                                                                            onSelectedShift={(date, shift) => handleOnSelectedShift(formik, date, shift)}
                                                                        />
                                                                        <div class="row px-2">
                                                                            <input
                                                                                type="type"
                                                                                name="represent_shift"
                                                                                value={formik.values.represent_shift}
                                                                                onChange={formik.handleChange}
                                                                                className="form-control col-md-2 mr-1"
                                                                            />
                                                                            <input
                                                                                type="type"
                                                                                name="represent_date"
                                                                                value={formik.values.represent_date}
                                                                                onChange={formik.handleChange}
                                                                                className="form-control col-md-4"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}


                                                        </div>

                                                    </div>
                                                </Col>
                                                </Row>
                                                <Row>
                                                <Col className='text-center'>
                                                    <Button
                                                        type="submit"
                                                        variant="primary"
                                                    >
                                                        บันทึกเปลี่ยนเวร
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    )
                                }}
                            </Formik>

                        </div>{/* <!-- /.card-body --> */}
                    </div>{/* <!-- /.card --> */}
                </section>
            </div>{/* <!-- Main row --> */}
        </div>
    )
}

export default ShiftSwappingForm
