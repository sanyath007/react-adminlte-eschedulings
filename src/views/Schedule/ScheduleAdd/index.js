import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import api from '../../../api';
import { calculateShiftsTotal, calculateTotal } from '../../../utils';
import ShiftInput from '../../../components/FormInputs/ShiftInput';
import DailyColumns from '../../../components/DailyColumns';
import PersonModal from '../../Modals/PersonModal';
import PersonShiftsRow from '../PersonShiftsRow';
import TotalShifts from '../TotalShifts';
import th from 'date-fns/locale/th'
registerLocale("th", th);

let tmpDeparts = [];
let tmpDivisions = [];
let tmpPersonShifts = [];

const scheduleSchema = Yup.object().shape({
    depart: Yup.string().required('Depart!!!'),
    month: Yup.string().required('Month!!!'),
    year: Yup.string().required('Year!!!'),
    controller: Yup.string().required('Controller!!!')
});

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

    /** =========================== TODO: Duplicated Code =========================== */
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
    /** =========================== TODO: Duplicated Code =========================== */

    const onFactionChange = function (faction) {
        setDeparts(tmpDeparts.filter(dep => dep.faction_id === parseInt(faction)));
    };

    const onDepartChange = function (depart) {
        setDivisions(tmpDivisions.filter(div => div.depart_id === parseInt(depart)));

        getMemberOfDepart(depart);
    };

    const getMemberOfDepart = async function (depart) {
        try {
            const res = await api.get(`/departs/${depart}/member-of`);

            setDivisionMembers(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getInitForm = async function (e) {
        try {
            const res = await api.get('/schedulings/add/init-form');

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

    const onAddPersonShifts = function (e, formik) {
        if (!personSelected) {
            toast.error('กรุณาเลือกบุคลากรก่อน !!!', { autoClose: 1000, hideProgressBar: true });
            return;
        }

        /** Check duplicated person */
        if (personShifts.some(ps => ps.person.person_id === personSelected.person_id)) {
            toast.error('คุณเลือกบุคลากรซ้ำ !!!', { autoClose: 1000, hideProgressBar: true });
            return;
        }

        let shifts = [];
        [...Array(tableCol)].forEach((obj, date) => {
            shifts.push(`${tmpPersonShifts[date][date+ '_1']}|${tmpPersonShifts[date][date+ '_2']}|${tmpPersonShifts[date][date+ '_3']}`);
        });

        const shiftsTotal = calculateShiftsTotal(shifts);
        const newDetails = [
            ...personShifts,
            {
                person: personSelected,
                shifts,
                n: shiftsTotal.night,
                m: shiftsTotal.morn,
                e: shiftsTotal.even,
                b: shiftsTotal.bd,
                total: shiftsTotal.night + shiftsTotal.morn + shiftsTotal.even + shiftsTotal.bd
            }
        ];

        setPersonShifts(newDetails);

        // TODO: Calculate total shifts
        const total = calculateTotal(newDetails);
        formik.setFieldValue('total_m', total.morn);
        formik.setFieldValue('total_e', total.even);
        formik.setFieldValue('total_n', total.night);
        formik.setFieldValue('total_bd', total.bd);
        formik.setFieldValue('total_shifts', total.morn+total.even+total.night+total.bd);

        /** Calculate total persons */
        formik.setFieldValue('total_persons', personShifts.length + 1);

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

        // TODO: Calculate total shifts
        const total = calculateTotal(ps);
        formik.setFieldValue('total_m', total.morn);
        formik.setFieldValue('total_e', total.even);
        formik.setFieldValue('total_n', total.night);
        formik.setFieldValue('total_bd', total.bd);
        formik.setFieldValue('total_shifts', total.morn+total.even+total.night+total.bd);

        /** Calculate total person */
        formik.setFieldValue('total_persons', ps.length);
    };

    const onSubmit = async function (values, props) {
        if (personShifts.length === 0) {
            toast.error('กรุณาเพิ่มรายการเวรของบุคลากรก่อน !!!', { autoClose: 1000, hideProgressBar: true });
            return;
        }

        // Merge form input's values with personShifts array
        const {
            depart,
            division,
            month,
            year,
            schedule_type_id,
            controller,
            total_persons,
            total_shifts,
            remark
        } = values;

        const data = {
            depart,
            division,
            month: moment(month).format('YYYY-MM'),
            year,
            schedule_type_id,
            controller,
            person_shifts: personShifts,
            total_m: values.total_m,
            total_e: values.total_e,
            total_n: values.total_n,
            total_bd: values.total_bd,
            total_shifts,
            total_persons,
            remark
        };

        // Store data to db
        let res = await api.post(`/schedulings`, data);
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

            <div className="row">
                <section className="col-lg-12 connectedSortable">

                    <Formik
                        initialValues={{
                            depart: '',
                            division: '',
                            month: new Date(),
                            year: '2565',
                            schedule_type_id: '',
                            controller: '',
                            total_m: 0,
                            total_e: 0,
                            total_n: 0,
                            total_bd: 0,
                            total_shifts: 0,
                            total_persons: 0,
                            remark: ''
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

                                    <PersonModal
                                        isOpen={openModal}
                                        hideModal={() => setOpenModal(false)}
                                        onSelected={(person) => {
                                            setPersonSelected(person);
                                            setToggleShiftVal(false);
                                        }}
                                        faction={formik.values.faction}
                                        depart={formik.values.depart}
                                    />

                                    <Form>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="form-group col-md-4">
                                                    <label>กลุ่มภารกิจ :</label>
                                                    <select
                                                        className="form-control"
                                                        id="faction"
                                                        name="faction"
                                                        onChange={(e) => {
                                                            formik.setFieldValue('faction', e.target.value);
                                                            onFactionChange(e.target.value);
                                                        }}
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
                                                            formik.setFieldValue('division', '');
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
                                                        onChange={formik.handleChange}
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
                                                <div className="form-group col-md-2">
                                                    <label>ประจำเดือน :</label>
                                                    <DatePicker
                                                        selected={formik.values.month}
                                                        onChange={(date) => {
                                                            formik.setFieldValue('month', date);
                                                            formik.setFieldValue('year', date.getMonth() > 8 ? date.getFullYear() + 544 : date.getFullYear() + 543)
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
                                                <div className="form-group col-md-2">
                                                    <label>ปีงบประมาณ :</label>
                                                    <Field
                                                        name=""
                                                        value={formik.values.year}
                                                        className={ `form-control` }
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label>ประเภท :</label>
                                                    <select
                                                        className={ `form-control ${formik.errors.schedule_type_id && formik.touched.schedule_type_id ? 'is-invalid' : ''}` }
                                                        id="schedule_type_id"
                                                        name="schedule_type_id"
                                                        value={formik.values.schedule_type_id}
                                                        onChange={(e) => {
                                                            formik.setFieldValue('schedule_type_id', e.target.value);
                                                        }}
                                                    >
                                                        <option value="">-- เลือกประเภท --</option>
                                                        <option value="1">ตารางเวรพยาบาล</option>
                                                        <option value="2">ตารางเวรผู้ช่วยพยาบาล/ผู้ช่วยเหลือคนไข้</option>
                                                    </select>
                                                    {formik.errors.schedule_type_id && formik.touched.schedule_type_id 
                                                        ? (<div className="invalid-feedback">{formik.errors.schedule_type_id}</div>) 
                                                        : null
                                                    }
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label>ผู้ควบคุม/หน.กลุ่มงาน/หน.งาน :</label>
                                                    <select
                                                        id="controller"
                                                        name="controller"
                                                        value={formik.values.controller}
                                                        className={ `form-control ${formik.errors.controller && formik.touched.controller ? 'is-invalid' : ''}` }
                                                        onChange={formik.handleChange}
                                                    >
                                                        <option value="">-- เลือกผู้ควบคุม --</option>
                                                        {divisionMembers && divisionMembers.map(person => {
                                                            return (
                                                                <option key={person.person_id} value={ person.person_id }>
                                                                    { person.prefix.prefix_name+person.person_firstname+ ' ' +person.person_lastname }
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
                                                            cols={tableCol}
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
                                                                        /><br />

                                                                        <ShiftInput
                                                                            shifts={shifts}
                                                                            onSelected={(shift) => {
                                                                                tmpPersonShifts[date][`${date}_2`] = shift;
                                                                                setShiftOfDay(`${date}_2_${shift}`);
                                                                            }}
                                                                            defaultVal={toggleShiftVal}
                                                                        /><br />

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
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="" className="col-form-label">หมายเหตุ</label>
                                                        <Field
                                                            as="textarea"
                                                            name="remark"
                                                            value={formik.values.remark}
                                                            className={ `form-control` }
                                                            rows={5}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3"></div>
                                                <div className="col-md-3">
                                                    <div
                                                        className="row"
                                                        style={{
                                                            textAlign: 'center',
                                                            justifyContent: 'flex-end',
                                                            paddingRight: '0.5rem'
                                                        }}
                                                    >
                                                        <div className="form-group">
                                                            <label htmlFor="">ช</label>
                                                            <div className="form-control" style={{ width: '51px'}}>
                                                                {formik.values.total_m}
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="">บ</label>
                                                            <div className="form-control" style={{ width: '51px'}}>
                                                                {formik.values.total_e}
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="">ด</label>
                                                            <div className="form-control" style={{ width: '51px'}}>
                                                                {formik.values.total_n}
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="">BD</label>
                                                            <div className="form-control" style={{ width: '51px'}}>
                                                                {formik.values.total_bd}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="" className="col-sm-6 col-form-label">เวรทั้งหมด</label>
                                                        <div className="col-sm-6">
                                                            <Field
                                                                name="total_shifts"
                                                                value={formik.values.total_shifts}
                                                                className={ `form-control text-center` }
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="" className="col-sm-6 col-form-label">บุคลากรทั้งหมด</label>
                                                        <div className="col-sm-6">
                                                            <Field
                                                                name="total_persons"
                                                                value={formik.values.total_persons}
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
