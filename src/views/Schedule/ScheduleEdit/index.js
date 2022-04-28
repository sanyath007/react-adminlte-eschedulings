import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import api from '../../../api';
import { getScheduleById } from '../../../features/schedules';
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

const initialTotal = {
    night: 0,
    morn: 0,
    even: 0,
    bd: 0
};

const scheduleSchema = Yup.object().shape({
    depart: Yup.string().required('Depart!!!'),
    month: Yup.string().required('Month!!!'),
    year: Yup.string().required('Year!!!'),
    controller: Yup.string().required('Controller!!!')
});

const ScheduleEdit = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [factions, setFactions] = useState([]);
    const [departs, setDeparts] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [divisionMembers, setDivisionMembers] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [tableCol, setTableCol] = useState(31);
    const [personSelected, setPersonSelected] = useState(null);
    const [personShifts, setPersonShifts] = useState([]);
    const [toggleShiftVal, setToggleShiftVal] = useState(false);
    const [shiftOfDay, setShiftOfDay] = useState('');

    const { id } = useParams();
    const schedule = useSelector(state => getScheduleById(state, id));

    useEffect(() => {
        /** To redirect to /schedules/list if schedule is null */
        if (!schedule) {
            history.push('/schedules/list');
        } else {
            /** Fetch form dropdown inputs data */
            getInitForm();
    
            /** Format person's shifts of editting schedule data to array */
            setPersonShifts(schedule.shifts.map(ps => ({ id: ps.id, person: ps.person, shifts: ps.shifts.split(',') })));

            /** TODO: To filter departments and divisions of selected faction */
            setDeparts(tmpDeparts.filter(dep => dep.depart_id == schedule.division.depart_id));
            setDivisions(tmpDivisions.filter(div => div.division_id == schedule.division_id));
    
            /** Get persons that are member of editting schedule's division */
            getMemberOfDepart(schedule.division.depart_id);

            if (schedule) {
                setTableCol(moment(schedule.month).endOf('month').date());

                /** Generate shift inputs on each days of editting schedule's month */
                tmpPersonShifts = generateShiftDays(tableCol);
            }
        }
    }, [schedule]);

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
        setDeparts(tmpDeparts.filter(dep => dep.faction_id === faction));
    };

    const onDepartChange = function (depart) {
        setDivisions(tmpDivisions.filter(div => div.depart_id === depart));

        getMemberOfDepart(depart);
    };

    const getMemberOfDepart = async function (depart) {
        try {
            const res = await api.get(`/api/schedulings/member-of/depart/${depart}`);

            setDivisionMembers(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getInitForm = async function (e) {
        try {
            const res = await api.get('/api/schedulings/add/init-form');

            setFactions(res.data.factions);
            setDeparts(res.data.departs);
            setDivisions(res.data.divisions);
            setShifts(res.data.shifts);
            setHolidays(res.data.holidays);

            tmpDeparts = res.data.departs;
            tmpDivisions = res.data.divisions;
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
                    if (['ด','ด*','ด**','ด^'].includes(el)) {
                        total.night += 1;
                    } else if (['ช','ช*','ช**','ช^'].includes(el)) {
                        total.morn += 1;
                    } else if (['บ','บ*','บ**','บ^'].includes(el)) {
                        total.even += 1;
                    } else if (['B','B*','B**','B^'].includes(el)) {
                        total.bd += 0.5;
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

        /** Check duplicated person */
        if (personShifts.some(ps => ps.person.person_id === personSelected.person_id)) {
            toast.error('คุณเลือกบุคลากรซ้ำ !!!', { autoClose: 1000, hideProgressBar: true });
            return;
        }

        let shifts = [];
        [...Array(tableCol)].forEach((obj, date) => {
            shifts.push(`${tmpPersonShifts[date][date+ '_1']}|${tmpPersonShifts[date][date+ '_2']}|${tmpPersonShifts[date][date+ '_3']}`);
        });

        /** =========================== TODO: Duplicated Code =========================== */
        let tmpTotal = { ...initialTotal };

        shifts.forEach((shift, day) => {
            let arrShift = shift.split('|');

            arrShift.forEach(el => {
                if (['ด','ด*','ด**','ด^'].includes(el)) {
                    tmpTotal.night += 1;
                } else if (['ช','ช*','ช**','ช^'].includes(el)) {
                    tmpTotal.morn += 1;
                } else if (['บ','บ*','บ**','บ^'].includes(el)) {
                    tmpTotal.even += 1;
                } else if (['B','B*','B**','B^'].includes(el)) {
                    tmpTotal.bd += 0.5;
                }
            });
        });
        /** =========================== Duplicated Code =========================== */

        const total_shift = tmpTotal.night + tmpTotal.morn + tmpTotal.even + tmpTotal.bd;
        const newRow = [
            ...personShifts,
            {
                person: personSelected,
                shifts,
                n: tmpTotal.night,
                m: tmpTotal.morn,
                e: tmpTotal.even,
                b: tmpTotal.bd,
                total_shift
            }
        ];
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

    console.log(personShifts);

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
        const { depart, division, month, year, controller, total_persons, total_shifts, remark } = values;
        let data = {
            depart,
            division,
            month: moment(month).format('YYYY-MM'),
            year,
            controller,
            person_shifts: personShifts,
            total_persons,
            total_shifts,
            remark
        };

        /** Update data to db */
        let res = await api.put(`/api/schedulings/${id}`, data);

        if (res.data.status === 1) {
            toast.success('แก้ไขข้อมูลเรียบร้อย !!!', { autoClose: 1000, hideProgressBar: true });
        } else {
            toast.error('พบข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้ !!!', { autoClose: 1000, hideProgressBar: true });
        }

        /** TODO: Clear form input's values */
        // props.resetForm();
        // setPersonShifts([]);
    };

    return (
        <div className="container-fluid">
            {/* <!-- Main row --> */}

            <div className="row">
                <section className="col-lg-12 connectedSortable">

                    <Formik
                        enableReinitialize={schedule}
                        initialValues={{
                            faction: schedule ? schedule.division.faction_id : '',
                            depart: schedule ? schedule.division.depart_id : '',
                            division: schedule ? schedule.division_id : '',
                            month: schedule ? moment(schedule.month).toDate() : '',
                            year: schedule ? schedule.year : '2565',
                            controller: schedule ? schedule.controller_id : '',
                            total_persons: schedule ? schedule.total_persons : 0,
                            total_shifts: schedule ? schedule.total_shifts : 0,
                            remark: schedule ? schedule.remark :''
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
                                                        value={formik.values.faction}
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
                                                <div className="form-group col-md-4">
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
                                                    {/* TODO: Duplicated code */}
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
                                                    {/* TODO: Duplicated code */}
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
                                                        <label htmlFor="inputEmail3" className="col-form-label">หมายเหตุ</label>
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

export default ScheduleEdit;
