import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import moment from 'moment';
import { getAllSchedules } from '../../../features/schedules';
import { getScheduleDetailsById, swap } from '../../../features/scheduleDetails';
import DelegatorShifts from './DelegatorShifts';
import PersonModal from '../../Modals/PersonModal';

const shiftSwappingSchema = Yup.object().shape({
    reason: Yup.string().required('Reason!!!'),
    delegator: Yup.string().required('Delegator!!!'),
});

const ShiftSwappingForm = () => {
    const { id, date: dateToSwap, shift: shiftToSwap } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    /** =================== Global's states ===================  */
    const { schedules } = useSelector(getAllSchedules);
    const shiftsOfOwner = useSelector(state => getScheduleDetailsById(state, id));
    /** =================== Component's states ===================  */
    const [schedule, setSchedule] = useState([]);
    const [personsOfSchedule, setPersonsOfSchedule] = useState([]);
    const [shiftsOfDelegator, setShiftsOfDelegator] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (!shiftsOfOwner) {
            history.push('/schedules/list')
        } else {
            const _schedule = schedules.find(sch => sch.id === parseInt(shiftsOfOwner.scheduling_id));
            setSchedule(_schedule);

            /** ดึงรายการเจ้าหน้าที่ที่มีในตารางเวร */
            const persons = _schedule.shifts
                                .filter(shift => shift.person_id !== shiftsOfOwner.person_id)
                                .map(shift => shift.person);
            setPersonsOfSchedule(persons);
        }
    }, []);

    const isOverLoaded = function (personShifts, compareDate) {
        return personShifts.some((sh, index) => {
            if (parseInt(moment(compareDate).format('DD')) === (index+1)) {
                const sumShift = sh.split('|').reduce((sum, curVal) => {
                    if (curVal !== '') return sum += 1;
                    
                    return sum;
                }, 0);

                if (sumShift >= 2) return true;
            }

            return false;
        });
    };

    const isSameShift = function (personShifts, compareDate, compareShift) {
        return personShifts.some((sh, index) => {
            return parseInt(moment(compareDate).format('DD')) === (index+1) && sh.indexOf(compareShift) !== -1;
        });
    };

    const onSelectedDelegator = function (formik, personId, fromOtherWard) {
        /** ตรวจสอบว่าเป็นกรณีขึ้นเวรแทนจากวอร์ดอื่นหรือไม่ */
        if (!fromOtherWard) {
            const delegatorSchedule = schedule.shifts.find(shift => shift.person_id === personId);
            const delegatorShifts = delegatorSchedule.shifts.split(',');

            /** ถ้าเป็นกรณีไม่ขึ้นปฏิบัติงานแทน (ขายเวร) ตรวจสอบก่อนว่างผู้รับว่างหรือไม่ */
            if (formik.values.no_swap && (isSameShift(delegatorShifts, dateToSwap, shiftToSwap) || isOverLoaded(delegatorShifts, dateToSwap))) {
                toast.error('ไม่สามารถเลือกได้ เนื่องจากผู้รับมีเวรแล้ว หรือ มีเวรเกินกำหนดแล้ว !!!', { autoClose: 2000, hideProgressBar: true });

                formik.setFieldValue('delegator', '');
                formik.setFieldValue('selectedDelegator', '');
            } else {
                formik.setFieldValue('delegator', personId);
                formik.setFieldValue('fromOtherWard', false);

                setShiftsOfDelegator(delegatorSchedule);
            }
        } else {
            formik.setFieldValue('delegator', personId);
            formik.setFieldValue('fromOtherWard', true);
        }
    };

    const handleOnSelectedShift = function (formik, date, shift) {
        // if (moment(date).isBefore(moment())) {
        //     toast.error('ไม่สามารถเลือกผ่านมาแล้วได้ !!!', { autoClose: 2000, hideProgressBar: true });
        // }

        /** Check if owner have same shift on same day the request would be denied */
        const ownerShifts = shiftsOfOwner.shifts.split(',');

        /** ถ้าเป็นกรณีเปลี่ยน/สลับเวรกัน */
        if (!formik.values.no_swap) {
            if (isSameShift(ownerShifts, date, shift)) {
                toast.error('ไม่สามารถเลือกได้ เนื่องจากผู้ขอเปลี่ยนมีเวรตรงกันในวันที่ขอเปลี่ยน !!!', { autoClose: 2000, hideProgressBar: true });

                formik.setFieldValue('swap_date', '');
                formik.setFieldValue('swap_shift', '');
            } else if (isOverLoaded(ownerShifts, date)) {
                toast.error('ไม่สามารถเลือกได้ เนื่องจากผู้ขอเปลี่ยนมีเวรเกินกำหนดในวันที่ขอเปลี่ยน !!!', { autoClose: 2000, hideProgressBar: true });

                formik.setFieldValue('swap_date', '')
                formik.setFieldValue('swap_shift', '')
            } else {
                formik.setFieldValue('swap_date', moment(date).format('YYYY-MM-DD'));
                formik.setFieldValue('swap_shift', shift);
            }
        }
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
        const owner = updatePersonShifts(shiftsOfOwner, true, values);

        /** Update delegator's shifts */
        const delegator = updatePersonShifts(shiftsOfDelegator, false, values);

        try {
            await dispatch(swap({
                id,
                data: {
                    scheduling_id: shiftsOfOwner.scheduling_id,
                    owner_shifts: owner.join(),
                    delegator_shifts: delegator.join(),
                    delegator_detail_id: shiftsOfDelegator.id,
                    ...values
                }
            })).unwrap();
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
                                enableReinitialize={shiftsOfOwner}
                                initialValues={{
                                    owner_date: dateToSwap,
                                    owner_shift: shiftToSwap,
                                    reason: '',
                                    delegator: '',
                                    delegator_desc: '',
                                    selectedDelegator: '',
                                    fromOtherWard: false,
                                    no_swap: false,
                                    swap_date: '',
                                    swap_shift: '',
                                }}
                                onSubmit={onSubmit}
                                validationSchema={shiftSwappingSchema}
                            >
                                {(formik) => {
                                    return (
                                        <Form>
                                            <Row>
                                                <Col>
                                                    <span className='my-1'>
                                                        <span className='mr-1' style={{ fontWeight: 'bold' }}>ข้าพเจ้า</span> 
                                                        {shiftsOfOwner && 
                                                            shiftsOfOwner.person.prefix.prefix_name+shiftsOfOwner.person.person_firstname+ ' ' +shiftsOfOwner.person.person_lastname
                                                        }
                                                    </span>
                                                    <span className='my-1 ml-2'>
                                                        <span className='mr-1' style={{ fontWeight: 'bold' }}>ตำแหน่ง</span>
                                                        {shiftsOfOwner && 
                                                            shiftsOfOwner.person.position.position_name
                                                        }
                                                    </span>
                                                    <div>
                                                        <span className='my-1'>
                                                            ขออนุญาตเปลี่ยน <span className='mr-1'>เวร</span>
                                                            {shiftToSwap}
                                                        </span>
                                                        <span className='my-1 ml-2'>
                                                            <span className='mr-1'>ของวันที่</span>
                                                            {moment(dateToSwap).format('DD/MM/YYYY')}
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
                                                                onChange={(e) => {
                                                                    formik.setFieldValue('no_swap', e.target.checked);
                                                                    formik.setFieldValue('fromOtherWard', false);
                                                                    formik.setFieldValue('delegator', '');
                                                                    formik.setFieldValue('selectedDelegator', '');
                                                                }}
                                                            /> โดยไม่ขึ้นปฏิบัติงานแทน )
                                                            
                                                            {!formik.values.fromOtherWard ? (
                                                                <div className="input-group">
                                                                    <select
                                                                        name="delegator"
                                                                        className="form-control"
                                                                        value={formik.values.selectedDelegator}
                                                                        onChange={(e) => {
                                                                            formik.setFieldValue('selectedDelegator', e.target.value);

                                                                            onSelectedDelegator(formik, e.target.value, false);
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
                                                                    {formik.values.no_swap && (
                                                                        <span className="input-group-append">
                                                                            <a
                                                                                href="#"
                                                                                className="btn btn-danger"
                                                                                onClick={() => setOpenModal(true)}
                                                                            >
                                                                                เลือกจากวอร์ดอื่น
                                                                            </a>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="input-group">
                                                                    <input
                                                                        type="text"
                                                                        name="delegator_desc"
                                                                        value={formik.values.delegator_desc}
                                                                        onChange={formik.handleChange}
                                                                        className="form-control"
                                                                    />
                                                                    <span className="input-group-append">
                                                                        <a
                                                                            href="#"
                                                                            className="btn btn-secondary"
                                                                            onClick={() => formik.setFieldValue('fromOtherWard', false)}
                                                                        >
                                                                            เลือกวอร์ดเดียวกัน
                                                                        </a>
                                                                    </span>
                                                                </div>
                                                            )}

                                                        </div>

                                                        <PersonModal
                                                            isOpen={openModal}
                                                            hideModal={() => setOpenModal(false)}
                                                            onSelected={(person) => {
                                                                if (person) {
                                                                    onSelectedDelegator(formik, person.person_id, true);

                                                                    console.log(person);
                                                                    formik.setFieldValue("delegator_desc", `${person.person_firstname} ${person.person_lastname}`);
                                                                }
                                                            }}
                                                            faction={5}
                                                        />

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

export default ShiftSwappingForm;
