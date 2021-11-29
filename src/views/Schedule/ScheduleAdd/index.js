import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import moment from 'moment';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import api from '../../../api';
import ShiftInput from '../../../components/FormInputs/ShiftInput';
import PersonModal from '../../Modals/PersonModal';
import PersonShiftsRow from './PersonShiftsRow';
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

const ScheduleAdd = () => {
    const dispatch = useDispatch();
    const [factions, setFactions] = useState([]);
    const [departs, setDeparts] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [divisionMembers, setDivisionMembers] = useState([]);
    const [tableCol, setTableCol] = useState(moment().endOf('month').date());
    const [personSelected, setPersonSelected] = useState(null);
    const [personShifts, setPersonShifts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [toggleShiftVal, setToggleShiftVal] = useState(false);

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
            const res = await api.get('/api/schedulings/add');

            setFactions(res.data.factions);
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

    const onAddPersonShifts = function () {
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

        /** Clear all inputs value of action row  */
        setPersonSelected(null);
        setToggleShiftVal(true);
    };

    const onSubmit = function (values, props) {
        if (personShifts.length === 0) {
            toast.error('กรุณาเพิ่มรายการเวรของบุคลากรก่อน !!!', { autoClose: 1000, hideProgressBar: true });
            return;
        }

        // TODO: Merge form input's values with personShifts array
        const { depart, division, month, year, controller } = values;
        let data = { depart, division, month, year, controller, personShifts };

        // TODO: Store data to db

        // TODO: Reset form input's values
    };

    const renderDailyCols = function () {
        return (
            <tr>
                {[...Array(tableCol)].map((m, i) => {
                    return (
                        <td
                            key={i}
                            style={
                                { width: '2%', textAlign: 'center', fontSize: 'small' }
                            }
                        >
                            { i + 1 }
                        </td>
                    );
                })}
            </tr>
        );
    };

    const renderTotalShifts = function () {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>ด=</span>
                <span>ช=</span>
                <span>บ=</span>
                <span>BD=</span>
            </div>
        );
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
                            year: '',
                            controller: ''
                        }}
                        validationSchema={scheduleSchema}
                        onSubmit={onSubmit}
                    >
                        {(formik) => {
                            return (
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">
                                            <i className="fas fa-hospital-user"></i>
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
                                                    <DatePicker
                                                        selected={formik.values.year}
                                                        onChange={(date) => formik.setFieldValue('year', date)}
                                                        dateFormat="yyyy"
                                                        locale="th"
                                                        showYearPicker
                                                        className={ `form-control ${formik.errors.year && formik.touched.year ? 'is-invalid' : ''}` }
                                                    />
                                                    {formik.errors.year && formik.touched.year 
                                                        ? (<div className="text-danger text-sm">{formik.errors.year}</div>) 
                                                        : null
                                                    }
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

                                            <table className="table table-bordered table-striped" style={{ fontSize: '14px' }}>
                                                <thead>
                                                    <tr>
                                                        <td style={{ textAlign: 'center' }} rowSpan="2">ชื่อ-สกุล</td>
                                                        <td style={{ textAlign: 'center' }} colSpan={ tableCol }>
                                                            วันที่
                                                        </td>
                                                        <td style={{ width: '2.5%', textAlign: 'center' }} rowSpan="2">รวม</td>
                                                        <td style={{ width: '5%', textAlign: 'center' }} rowSpan="2">Actions</td>
                                                    </tr>
                                                    { renderDailyCols() }
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
                                                                        onSelected={(shift) => {
                                                                            tmpPersonShifts[date][`${date}_1`] = shift;
                                                                        }}
                                                                        defaultVal={toggleShiftVal}
                                                                    />

                                                                    <ShiftInput
                                                                        onSelected={(shift) => {
                                                                            tmpPersonShifts[date][`${date}_2`] = shift;
                                                                        }}
                                                                        defaultVal={toggleShiftVal}
                                                                    />

                                                                    <ShiftInput
                                                                        onSelected={(shift) => {
                                                                            tmpPersonShifts[date][`${date}_3`] = shift;
                                                                        }}
                                                                        defaultVal={toggleShiftVal}
                                                                    />
                                                                </td>
                                                            );
                                                        })}
                                                        <td>{renderTotalShifts()}</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <a 
                                                                href="#"
                                                                className="btn btn-primary btn-sm" 
                                                                onClick={(e) => {
                                                                    onAddPersonShifts(e);
                                                                }}
                                                            >
                                                                เพิ่ม
                                                            </a>
                                                        </td>
                                                    </tr>

                                                    { /** Render all added rows */ }
                                                    {personShifts && personShifts.map(ps => {
                                                        return <PersonShiftsRow key={ps.person.person_id} row={ps} />;
                                                    })}

                                                </tbody>
                                            </table>

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
