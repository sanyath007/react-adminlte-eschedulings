import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import { toast } from 'react-toastify';
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
            setSchedule(schedule);

            /** ดึงรายการเจ้าหน้าที่จากตารางเวร */
            const persons = schedule.shifts
                                .filter(shift => shift.person_id !== scheduleDetails.person_id)
                                .map(shift => shift.person);
            setPersonsOfSchedule(persons);
        }
    }, []);

    const isOverLoaded = function (shift) {
        return shift.shifts
                    .split(",")
                    .some((sh, index) => {
                        if (parseInt(moment(date).format('DD')) === (index+1)) {
                            const sumShift = sh.split('|').reduce((sum, curVal) => {
                                if (curVal !== '') return sum += 1;
                                
                                return sum;
                            }, 0);

                            if (sumShift >= 2) return true;
                        }

                        return false;
                    });
    };

    const isSameShift = function (shift) {
        return  shift.shifts
                    .split(",")
                    .some((sh, index) => {
                        return parseInt(moment(date).format('DD')) === (index+1) && sh.indexOf(shiftText) !== -1;
                    });
    };

    const onSelectedDelegator = function (formik, personId) {
        formik.setFieldValue('delegator', personId);

        /** To Check if delegator have same shift on same day the request would be denied */
        const shift = schedule.shifts.find(shift => shift.person_id === personId);

        /** ถ้าผู้รับเวรมีเวรเหมือนกัน หรือ มีเวร 2 เวรแล้วจะไม่สามารถเลือกได้ */
        if (isSameShift(shift) || isOverLoaded(shift)) {
            toast.error('ไม่สามารถเลือกได้ จนท.มีเวรแล้ว หรือ มีเวรเกินกำหนดแล้ว !!!', { autoClose: 1000, hideProgressBar: true });

            formik.setFieldValue('delegator', '');
        }

        setShiftsOfDelegator(shift);
    };

    const handleOnSelectedShift = function (formik, date, shift) {
        formik.setFieldValue('swap_date', moment(date).format('YYYY-MM-DD'))
        formik.setFieldValue('swap_shift', shift)

        /** TODO: To Check if owner have same shift on same day the request would be denied */
        
    };

    const insertShiftText = function (shift) {
        let arrShift = shift.split('|');

        if (shift.split('|').every(sh => sh === '')) { /** If shift is all empty */
            arrShift[0] = 'R';
        } else { /** If shift is not empty */
            arrShift[1] = 'R';
        }

        return arrShift.join('|');
    };

    const delegateShiftText = function (shift) {
        let arrShift = shift.split('|');

        if (shift.split('|').every(sh => sh === '')) { /** If shift is all empty */
            arrShift[0] = 'D';
        } else { /** If shift is not empty */
            arrShift[1] = 'D';
        }

        return arrShift.join('|');
    };

    const updatePersonShifts = function (personShifts, isOwner, values) {
        return personShifts.shifts.split(',').map((shift, index) => {
            /** เซตเวรของวันที่ขอเปลี่ยนเป็น R (REQUEST)
             * และถูกลบออกเมื่อได้รับการอนุมัติแล้ว
             **/
            if (parseInt(moment(values.owner_date).format('DD')) === (index+1)) {
                /** If person is not owner */
                if (isOwner) {
                    console.log('Is owner!!');
                    if (shift.split('|').every(sh => sh === '')) return 'R||';

                    return shift.replace(values.owner_shift, 'R')
                }

                /** If person is owner */
                return insertShiftText(shift);
            }

            if (!values.no_swap) {
                console.log('Is on swap shift !!!');
                /** TODO: ถ้าเป็นการสลับเวร/แลก ให้เซตเวรของวันที่รับแลกเป็น D (DELEGATE)
                 * และจะถูกเปลี่ยนเป็นเวรตามที่รับแลกเมื่อได้รับการอนุมัติแล้ว
                 **/
                if (parseInt(moment(values.swap_date).format('DD')) === (index+1)) {
                    /** If person is not owner */
                    console.log(moment(values.swap_date).format('DD'), shift);
                    if (!isOwner) {
                        console.log('Is delegator!!');
                        if (shift.split('|').every(sh => sh === '')) {
                            return 'D||';
                        }

                        return shift.replace(values.swap_shift, 'D')
                    }

                    /** If person is owner */
                    return delegateShiftText(shift);
                }
            }

            return shift;
        });
    };

    const onSubmit = async function (values, props) {
        /** Update owner's shifts */
        const ownerShifts = updatePersonShifts(scheduleDetails, true, values);

        /** Update delegator's shifts */
        const delegatorShifts = updatePersonShifts(shiftsOfDelegator, false, values);

        console.log({
            id,
            data: {
                owner_shifts: ownerShifts.join(),
                delegator_shifts: delegatorShifts.join(),
                swap_detail_id: shiftsOfDelegator.id,
                ...values
            }
        });

        try {
            // await dispatch(swap({
            //     id,
            //     data: {
            //         owner_shifts: ownerShifts.join(),
            //         delegator_shifts: delegatorShifts.join(),
            //         swap_detail_id: shiftsOfDelegator.id,
            //         ...values
            //     }
            // })).unwrap();
        } catch (err) {
            console.log(err);
        }
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
                                                            {moment(date).format('DD/MM/YYYY')}
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

                                                        {/* {!formik.values.no_swap && ( */}
                                                            <div className="form-group">
                                                                <label htmlFor="delegate">โดยข้าพเจ้าจะขึ้นปฏิบัติงานแทนในวันที่</label>

                                                                {/* Render delegate's shifts list */}
                                                                {formik.values.delegator && (
                                                                    <div className="card">
                                                                        <div className="card-body">

                                                                            <DelegatorShifts
                                                                                schedule={schedule}
                                                                                shiftsOfDelegator={shiftsOfDelegator}
                                                                                noSwap={formik.values.no_swap}
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
                                                        {/* )} */}

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
