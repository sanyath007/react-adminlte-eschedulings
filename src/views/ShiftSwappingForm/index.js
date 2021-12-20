import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import {
    Button,
    Col,
    Row
} from 'react-bootstrap';
import { Formik, Form } from 'formik';
import api from '../../api';
import { getAllSchedules } from '../../features/schedules';
import { getScheduleDetailsById } from '../../features/scheduleDetails';
import DailyColumns from '../../components/DailyColumns';

const ShiftSwappingForm = () => {
    const [schedule, setSchedule] = useState([]);
    const [holidays, setHolidays] = useState([]);
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
            getHolidays();

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

    const getHolidays = async function () {
        try {
            const res = await api.get(`/api/holidays`);

            setHolidays(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const onSubmit = function () {

    };

    const getEventBgColor = function (shift) {
        let btnColor = '';
        if (['ด','ด*','ด**','ด^'].includes(shift)) {
            btnColor = 'btn-info';
        } else if (['ช','ช*','ช**','ช^'].includes(shift)) {
            btnColor = 'btn-success';
        } else if (['บ','บ*','บ**','บ^'].includes(shift)) {
            btnColor = 'btn-danger';
        } else if (['B','B*','B**','B^'].includes(shift)) {
            btnColor = 'btn-warning';
        } else {
            btnColor = 'btn-default';
        }

        return btnColor;
    };

    const renderShiftsOfDay = function (shift) {
        return shift.split('|').map((sh, index) => {
            return sh !== ''
                    ? <a key={sh+index} href="#" className={ `btn ${getEventBgColor(sh)} btn-sm mb-1` }>{sh}</a>
                    : null;
        });
    };

    const renderDelegateShifts = function () {
        return (
            <table className="table table-bordered table-striped mb-1">
                <thead>
                    <tr>
                        <td style={{ textAlign: 'center' }} colSpan={ 31 }>วันที่</td>
                    </tr>
                    <DailyColumns
                        month={schedule ? schedule.month : moment().format('YYYY-MM')}
                        holidays={holidays}
                    />
                </thead>
                <tbody>
                    <tr>
                        {shiftsOfPerson && shiftsOfPerson.shifts.split(',').map((shift, index) => {
                            return (
                                <td key={index} style={{ textAlign: 'center', fontSize: '14px', padding: '0' }}>
                                    {renderShiftsOfDay(shift)}
                                </td>
                            );
                        })}
                    </tr>
                </tbody>
            </table>
        );
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
                                initialValues={{
                                    reason: '',
                                    delegate: ''
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

                                                        {/* TODO: Render delegate's shifts list */}
                                                        {formik.values.delegate && (
                                                            <div className="card">
                                                                <div className="card-body">
                                                                    {renderDelegateShifts()}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                                </Row>
                                                <Row>
                                                <Col className='text-center mt-4'>
                                                    <Button
                                                        variant="primary"
                                                        className="mr-2"
                                                        onClick={() => console.log('On save!!')}
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
