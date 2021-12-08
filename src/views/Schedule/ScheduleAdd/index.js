import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import api from '../../../api';
import ShiftInput from '../../../components/FormInputs/ShiftInput';
import PersonModal from '../../Modals/PersonModal';
import PersonShiftsRow from './PersonShiftsRow';
import TotalShifts from './TotalShifts';
import DailyColumns from '../../../components/DailyColumns';
import th from 'date-fns/locale/th'
import "react-datepicker/dist/react-datepicker.css";
registerLocale("th", th);

let tmpDeparts = [];
let tmpDivisions = [];
let tmpPersonShifts = [];

const scheduleSchema = Yup.object().shape({
    depart: Yup.string().required('Depart!!!'),
    division: Yup.string().required('Division!!!'),
    month: Yup.string().required('Month!!!'),
    year: Yup.string().required('Year!!!'),
    controller: Yup.string().required('Controller!!!')
});

const initialTotal = {
    night: 0,
    morn: 0,
    even: 0,
    bd: 0
};

const ScheduleAdd = () => {
    const dispatch = useDispatch();
    const [factions, setFactions] = useState([]);
    const [departs, setDeparts] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [divisionMembers, setDivisionMembers] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [tableCol, setTableCol] = useState(moment().endOf('month').date());
    const [personSelected, setPersonSelected] = useState(null);
    const [personShifts, setPersonShifts] = useState([]);
    const [toggleShiftVal, setToggleShiftVal] = useState(false);
    const [shiftOfDay, setShiftOfDay] = useState('');

    useEffect(() => {
        getInitForm();

        tmpPersonShifts = generateShiftDays(tableCol);
    }, []);

    const generateShiftDays = function (days) {
        let _personShifts = [];
        /** Generate person's shift array */
        [...Array(days)].forEach((obj, date) => {
            _personShifts.push({
                [`${date}_1`]: '',
                [`${date}_2`]: '',
                [`${date}_3`]: '',
            });
        });

        return _personShifts;
    };

    const onFactionChange = function (faction) {
        setDeparts(tmpDeparts.filter(dep => dep.faction_id === faction));
    };

    const onDepartChange = function (depart) {
        setDivisions(tmpDivisions.filter(div => div.depart_id === depart));
    };

    const onDivisionChange = function (e) {
        console.log(e);
    };

    const getInitForm = async function (e) {
        try {
            const res = await api.get('/api/schedulings/add/init-form');

            setFactions(res.data.factions);
            tmpDeparts = res.data.departs;
            tmpDivisions = res.data.divisions;
            setShifts(res.data.shifts);
            setHolidays(res.data.holidays);
        } catch (err) {
            console.log(err);
        }
    };

    const setDatesOfMonth = function (date) {
        const daysOfMonth = moment(date).endOf('month').date();

        setTableCol(daysOfMonth);
        tmpPersonShifts = generateShiftDays(daysOfMonth);
    };

    const calculateTotal = (personShifts) => {
        let total = {
            night: 0,
            morn: 0,
            even: 0,
            bd: 0
        };

        personShifts.forEach(ps => {
            ps.shifts.forEach((shift, day) => {
                let arrShift = shift.split('|');
    
                arrShift.forEach(el => {
                    if (el === 'ด') {
                        total.night += 1;
                    } else if (el === 'ช') {
                        total.morn += 1;
                    } else if (el === 'บ') {
                        total.even += 1;
                    } else if (el === 'B') {
                        total.bd += 1;
                    }
                });
            });
        });

        return total.night + total.morn + total.even + total.bd;
    };

    const onAddPersonShifts = function (e, formik) {
        if (!personSelected) {
            toast.error('กรุณาเลือกบุคลากรก่อน !!!', { autoClose: 1000, hideProgressBar: true });
            return;
        }

        let shifts = [];
        [...Array(tableCol)].forEach((obj, date) => {
            shifts.push(`${tmpPersonShifts[date][date+ '_1']}|${tmpPersonShifts[date][date+ '_2']}|${tmpPersonShifts[date][date+ '_3']}`);
        });

        const newRow = [...personShifts, { person: personSelected, shifts }];
        setPersonShifts(newRow);

        /** Calculate total person */
        formik.setFieldValue('total_persons', personShifts.length + 1);

        // TODO: Calculate total shifts
        formik.setFieldValue('total_shifts', calculateTotal(newRow));

        /** Clear all inputs value of action row  */
        setPersonSelected(null);
        setToggleShiftVal(true);
        tmpPersonShifts = generateShiftDays(tableCol);
    };

    const onDeletePersonShifts = function (person, formik) {
        const ps = personShifts.filter(ps => {
            return ps.person.person_id !== person.person_id;
        });

        setPersonShifts(ps);

        /** Calculate total person */
        formik.setFieldValue('total_persons', ps.length);

        // TODO: Calculate total shifts
        formik.setFieldValue('total_shifts', calculateTotal(ps));
    };

    const onSubmit = async function (values, props) {
        if (personShifts.length === 0) {
            toast.error('กรุณาเพิ่มรายการเวรของบุคลากรก่อน !!!', { autoClose: 1000, hideProgressBar: true });
            return;
        }

        // Merge form input's values with personShifts array
        const { depart, division, month, year, controller, total_persons, total_shifts } = values;
        let data = {
            depart,
            division,
            month: moment(month).format('YYYY-MM'),
            year,
            controller,
            person_shifts: personShifts,
            total_persons,
            total_shifts
        };

        // Store data to db
        let res = await api.post(`/api/schedulings`, data);
        if (res.data.status === 1) {
            toast.success('บันทึกข้อมูลเรียบร้อย !!!', { autoClose: 1000, hideProgressBar: true });
        } else {
            toast.error('พบข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้ !!!', { autoClose: 1000, hideProgressBar: true });
        }

        // TODO: Clear form input's values
        props.resetForm();
        setPersonShifts([]);
    };

    return (
        <div className="container-fluid">
            {/* <!-- Main row --> */}
            <PersonModal
                isOpen={openModal}
                hideModal={() => setOpenModal(false)}
                onSelected={(person) => {
                    setPersonSelected(person);
                    setToggleShiftVal(false);
                }}
            />

            <div className="row">
                <section className="col-lg-12 connectedSortable">

                    <Formik
                        initialValues={{
                            depart: '',
                            division: '',
                            month: '',
                            year: '2565',
                            controller: '',
                            total_persons: 0,
                            total_shifts: 0
                        }}
                        validationSchema={scheduleSchema}
                        onSubmit={onSubmit}
                    >
                        {(formik) => {
                            return (
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">
                                            <i className="fas fa-hospital-user mr-1"></i>
                                            ตารางเวร
                                        </h3>
                                    </div>{/* <!-- /.card-header --> */}

                                    <Form>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="form-group col-md-4">
                                                    <label>กลุ่มภารกิจ :</label>
                                                    <select
                                                        className="form-control"
                                                        id="faction"
                                                        name="faction"
                                                        onChange={(e) => onFactionChange(e.target.value)}
                                                    >
                                                        <option value="">-- เลือกกลุ่มภารกิจ --</option>
                                                        {factions && factions.map(fac => {
                                                            return (
                                                                <option key={fac.faction_id} value={ fac.faction_id }>
                                                                    { fac.faction_name }
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label>กลุ่มงาน :</label>
                                                    <select
                                                        className={ `form-control ${formik.errors.depart && formik.touched.depart ? 'is-invalid' : ''}` }
                                                        id="depart"
                                                        name="depart"
                                                        value={formik.values.depart}
                                                        onChange={(e) => {
                                                            formik.setFieldValue('depart', e.target.value);
                                                            onDepartChange(e.target.value);
                                                        }}
                                                    >
                                                        <option value="">-- เลือกกลุ่มงาน --</option>
                                                        {departs && departs.map(dep => {
                                                            return (
                                                                <option key={dep.depart_id} value={ dep.depart_id }>
                                                                    { dep.depart_name }
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                    {formik.errors.depart && formik.touched.depart 
                                                        ? (<div className="invalid-feedback">{formik.errors.depart}</div>) 
                                                        : null
                                                    }
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label>งาน :</label>
                                                    <select
                                                        className={ `form-control ${formik.errors.division && formik.touched.division ? 'is-invalid' : ''}` }
                                                        id="division"
                                                        name="division"
                                                        value={formik.values.division}
                                                        onChange={
                                                            formik.handleChange
                                                            // onDivisionChange(newScheduling.division)
                                                        }
                                                    >
                                                        <option value="">-- เลือกงาน --</option>
                                                        {divisions && divisions.map(div => {
                                                            return (
                                                                <option key={div.ward_id} value={ div.ward_id }>
                                                                    { div.ward_name }
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                    {formik.errors.division && formik.touched.division 
                                                        ? (<div className="invalid-feedback">{formik.errors.division}</div>
                                                        ) : null
                                                    }
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label>ประจำเดือน :</label>
                                                    <DatePicker
                                                        selected={formik.values.month}
                                                        onChange={(date) => {
                                                            formik.setFieldValue('month', date);
                                                            formik.setFieldValue('year', date.getFullYear() + 543)
                                                            setDatesOfMonth(date);
                                                        }}
                                                        dateFormat="MM/yyyy"
                                                        locale="th"
                                                        showMonthYearPicker
                                                        className={ `form-control ${formik.errors.month && formik.touched.month ? 'is-invalid' : ''}` }
                                                    />
                                                    {formik.errors.month && formik.touched.month 
                                                        ? (<div className="text-danger text-sm">{formik.errors.month}</div>) 
                                                        : null
                                                    }
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label>ปีงบประมาณ :</label>
                                                    <Field
                                                        name=""
                                                        value={formik.values.year}
                                                        className={ `form-control` }
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label>ผู้ควบคุม :</label>
                                                    <select
                                                        id="controller"
                                                        name="controller"
                                                        value={formik.values.controller}
                                                        className={ `form-control ${formik.errors.controller && formik.touched.controller ? 'is-invalid' : ''}` }
                                                        onChange={formik.handleChange}
                                                    >
                                                        <option value="">-- เลือกผู้ควบคุม --</option>
                                                        <option value="1">Test</option>
                                                        {divisionMembers && divisionMembers.map(person => {
                                                            return (
                                                                <option value={ person.person_id }>
                                                                    { person.person_firstname+ ' ' +person.person_lastname }
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                    {formik.errors.controller && formik.touched.controller 
                                                        ? (<div className="invalid-feedback">{formik.errors.controller}</div>) 
                                                        : null
                                                    }
                                                </div>
                                            </div>
                                            
                                            <div style={{ overflowY: 'visible' }}>
                                                <table className="table table-bordered table-striped" style={{ fontSize: '14px' }}>
                                                    <thead>
                                                        <tr>
                                                            <td style={{ textAlign: 'center' }} rowSpan="2">ชื่อ-สกุล</td>
                                                            <td style={{ textAlign: 'center' }} colSpan={ tableCol }>
                                                                วันที่
                                                            </td>
                                                            <td style={{ width: '2.5%', textAlign: 'center' }} rowSpan="2">รวม</td>
                                                            <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">Actions</td>
                                                        </tr>
                                                        <DailyColumns
                                                            month={formik.values.month === '' ? moment().format('YYYY-MM') : moment(formik.values.month).format('YYYY-MM')}
                                                            holidays={holidays}
                                                        />
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                {personSelected && (
                                                                    <div>
                                                                        <p style={{ margin: '0px' }}>
                                                                            { `${personSelected.prefix?.prefix_name}${personSelected.person_firstname} ${personSelected.person_lastname}` }
                                                                        </p>
                                                                        <p style={{ color: 'grey', margin: '0px' }}>
                                                                            {personSelected.position?.position_name}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                <a
                                                                    href="#"
                                                                    className={ `btn ${personSelected ? 'btn-warning' : 'btn-primary'} btn-sm` }
                                                                    onClick={() => setOpenModal(true)}
                                                                >
                                                                    {personSelected ? 'เปลี่ยนบุคลากร' : 'เลือกบุคลากร'}
                                                                </a>
                                                            </td>
                                                            {[...Array(tableCol)].map((m, date) => {
                                                                return (
                                                                    <td
                                                                        key={date}
                                                                        style={
                                                                            {
                                                                                textAlign: 'center', 
                                                                                fontSize: 'small',
                                                                                padding: '0'
                                                                            }
                                                                        }
                                                                    >
                                                                        <ShiftInput
                                                                            shifts={shifts}
                                                                            onSelected={(shift) => {
                                                                                tmpPersonShifts[date][`${date}_1`] = shift;
                                                                                setShiftOfDay(`${date}_1_${shift}`);
                                                                            }}
                                                                            defaultVal={toggleShiftVal}
                                                                        />

                                                                        <ShiftInput
                                                                            shifts={shifts}
                                                                            onSelected={(shift) => {
                                                                                tmpPersonShifts[date][`${date}_2`] = shift;
                                                                                setShiftOfDay(`${date}_2_${shift}`);
                                                                            }}
                                                                            defaultVal={toggleShiftVal}
                                                                        />

                                                                        <ShiftInput
                                                                            shifts={shifts}
                                                                            onSelected={(shift) => {
                                                                                tmpPersonShifts[date][`${date}_3`] = shift;
                                                                                setShiftOfDay(`${date}_3_${shift}`);
                                                                            }}
                                                                            defaultVal={toggleShiftVal}
                                                                        />
                                                                    </td>
                                                                );
                                                            })}
                                                            <td>
                                                                <TotalShifts shifts={tmpPersonShifts} shiftOfDay={shiftOfDay} />
                                                            </td>
                                                            <td style={{ textAlign: 'center' }}>
                                                                <a 
                                                                    href="#"
                                                                    className="btn btn-success btn-sm" 
                                                                    onClick={(e) => onAddPersonShifts(e, formik)}
                                                                >
                                                                    <i className="fas fa-plus-circle"></i>
                                                                </a>
                                                            </td>
                                                        </tr>

                                                        { /** Render all added rows */ }
                                                        {personShifts && personShifts.map(ps => {
                                                            return (
                                                                <PersonShiftsRow
                                                                    key={ps.person.person_id} row={ps}
                                                                    onDelete={(person) => onDeletePersonShifts(person, formik)}
                                                                />
                                                            );
                                                        })}

                                                    </tbody>
                                                </table>
                                            </div>
                                            
                                            {/* Summary */}
                                            <div className="row">
                                                <div className="col-md-9"></div>
                                                <div className="col-md-3 pt-3">
                                                    <div className="form-group row">
                                                        <label htmlFor="inputEmail3" className="col-sm-6 col-form-label">บุคลากรทั้งหมด</label>
                                                        <div className="col-sm-6">
                                                            <Field
                                                                name="total_persons"
                                                                value={formik.values.total_persons}
                                                                className={ `form-control text-center` }
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="inputEmail3" className="col-sm-6 col-form-label">เวรทั้งหมด</label>
                                                        <div className="col-sm-6">
                                                            <Field
                                                                name="total_shifts"
                                                                value={formik.values.total_shifts}
                                                                className={ `form-control text-center` }
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>{/* <!-- /.card-body --> */}
                                        <div className="card-footer clearfix">
                                            <button type="reset" className="btn btn-danger float-right">ยกเลิก</button>
                                            <button type="submit" className="btn btn-primary float-right mr-2">บันทึก</button>
                                        </div>{/* <!-- /.card-footer --> */}
                                    </Form>
                                </div>
                            );
                        }}
                    </Formik>
        
                </section>
            </div>
            {/* <!-- Main row --> */}
        </div>
    );
}

export default ScheduleAdd;
