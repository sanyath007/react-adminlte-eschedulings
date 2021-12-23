import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import moment from 'moment';
import { getAllSchedules } from '../../features/schedules';
import { getScheduleDetailsById, swap } from '../../features/scheduleDetails';
import DelegatorShifts from './DelegatorShifts';

const ShiftSwappingForm = () => {
    const [schedule, setSchedule] = useState([]);
    const [personsOfSchedule, setPersonsOfSchedule] = useState([]);
    const [shiftsOfDelegator, setShiftsOfDelegator] = useState([]);

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

    const onSelectedDelegator = function (formik, personId) {
        formik.setFieldValue('delegator', personId);

        /** TODO: To Check if delegator have same shift on same day the request would be denied */
        setShiftsOfDelegator(schedule.shifts.find(shift => shift.person_id === personId));
    };

    const onSubmit = async function (values, props) {
        /** Update scheduleDetails's shifts */
        const ownerShifts = scheduleDetails.shifts.split(',').map((shift, index) => {
            /** เซตเวรของวันที่ขอเปลี่ยนเป็น R (REQUEST)
             * และถูกลบออกเมื่อได้รับการอนุมัติแล้ว
             **/
            if (parseInt(moment(values.owner_date).format('DD')) === (index+1)) {
                return shift.replace(values.owner_shift, 'R');
            }

            if (!values.no_swap) {
                /** ถ้าเป็นการสลับเวร/แลก ให้เซตเวรของวันที่รับแลกเป็น D (DELEGATE)
                 * และจะถูกเปลี่ยนเป็นเวรตามที่รับแลกเมื่อได้รับการอนุมัติแล้ว
                 **/
                if (parseInt(moment(values.swap_date).format('DD')) === (index+1)) {
                    return shift.replace(values.swap_shift, 'D');
                }
            }

            return shift;
        });

        /** Update delegator's shifts */
        const delegatorShifts = shiftsOfDelegator.shifts.split(',').map((shift, index) => {
            /** เซตเวรของวันที่รับเปลี่ยนเป็น R (REQUEST)
             * และจะถูกเปลี่ยนเป็นเวรตามที่รับเปลี่ยนเมื่อได้รับการอนุมัติแล้ว
             **/
            if (parseInt(moment(values.owner_date).format('DD')) === (index+1)) {
                return shift.replace(values.owner_shift, 'R');
            }

            if (!values.no_swap) {
                /** ถ้าเป็นการสลับเวร/แลก ให้เซตเวรของวันที่รับแลกเป็น D (DELEGATE)
                 * และถูกลบออกเมื่อได้รับการอนุมัติแล้ว
                 **/
                if (parseInt(moment(values.swap_date).format('DD')) === (index+1)) {
                    return shift.replace(values.swap_shift, 'D');
                }
            }

            return shift;
        });

        try {
            await dispatch(swap({
                id,
                data: {
                    owner_shifts: ownerShifts.join(),
                    delegator_shifts: delegatorShifts.join(),
                    swap_detail_id: shiftsOfDelegator.id,
                    ...values
                }
            })).unwrap();
        } catch (err) {
            console.log(err);
        }
    };

    const handleOnSelectedShift = function (formik, date, shift) {
        formik.setFieldValue('swap_date', moment(date).format('YYYY-MM-DD'))
        formik.setFieldValue('swap_shift', shift)
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
                                    owner_date: date,
                                    owner_shift: shiftText,
                                    reason: '',
                                    delegator: '',
                                    no_swap: true,
                                    swap_date: '',
                                    swap_shift: '',
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
                                                            scheduleDetails.person.prefix.prefix_name+scheduleDetails.person.person_firstname+ ' ' +scheduleDetails.person.person_lastname
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
                                                            <label htmlFor="delegate" className="mr-4">โดยมอบหมายให้</label>
                                                            ( <Field
                                                                type="checkbox"
                                                                name="no_swap"
                                                                onChange={(e) => formik.setFieldValue('no_swap', e.target.checked)}
                                                            /> โดยไม่ขึ้นปฏิบัติงานแทน )
                                                            <select
                                                                name="delegator"
                                                                className='form-control'
                                                                value={formik.values.delegator}
                                                                onChange={(e) => onSelectedDelegator(formik, e.target.value)}
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

                                                        {!formik.values.no_swap && (
                                                            <div className="form-group">
                                                                <label htmlFor="delegate">โดยข้าพเจ้าจะขึ้นปฏิบัติงานแทนในวันที่</label>

                                                                {/* Render delegate's shifts list */}
                                                                {formik.values.delegator && (
                                                                    <div className="card">
                                                                        <div className="card-body">
                                                                            
                                                                            <DelegatorShifts
                                                                                schedule={schedule}
                                                                                shiftsOfDelegator={shiftsOfDelegator}
                                                                                onSelectedShift={(date, shift) => handleOnSelectedShift(formik, date, shift)}
                                                                            />
                                                                            <div className="row px-2">
                                                                                <input
                                                                                    type="type"
                                                                                    name="swap_shift"
                                                                                    value={formik.values.swap_shift}
                                                                                    onChange={formik.handleChange}
                                                                                    className="form-control col-md-2 mr-1"
                                                                                />
                                                                                <input
                                                                                    type="type"
                                                                                    name="swap_date"
                                                                                    value={formik.values.swap_date}
                                                                                    onChange={formik.handleChange}
                                                                                    className="form-control col-md-4"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            </div>
                                                        )}

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
