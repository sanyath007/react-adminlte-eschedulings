import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import moment from 'moment';
import api from '../../../api';
import { getSchedulesSuccess } from '../../../features/schedule';
import ShiftInput from '../../../components/FormInputs/ShiftInput';
import PersonModal from '../../Modals/PersonModal';
import th from 'date-fns/locale/th'
import "react-datepicker/dist/react-datepicker.css";
registerLocale("th", th);

let tmpDeparts = [];
let tmpDivisions = [];

const ScheduleAdd = () => {
    const dispatch = useDispatch();
    const schedules = useSelector(state => state.schedule.schedules);
    const [factions, setFactions] = useState([]);
    const [departs, setDeparts] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [divisionMembers, setDivisionMembers] = useState([]);
    const [month, setMonth] = useState(new Date());
    const [year, setYear] = useState(new Date());
    const [tableCol, setTableCol] = useState(moment().endOf('month').date());
    const [personSelected, setPersonSelected] = useState({});
    const [personShifts, setPersonShifts] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        getInitForm();
    }, []);

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
    };

    const onAddPersonShifts = function () {

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

    const renderAddedRow = function () {
        personShifts && personShifts.map(person => {
            return (
                <tr key={person?.person_id}>
                    <td></td>
                    {person.shifts.map((shift, i) => {
                        return (
                            <td
                                key={i}
                                style={
                                    { width: '2%', textAlign: 'center', fontSize: 'small' }
                                }
                            >
                                { shift }
                            </td>
                        );
                    })}
                    <td></td>
                    <td></td>
                </tr>
            );
        });
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
        <section className="content">
            <div className="container-fluid">
                {/* <!-- Main row --> */}
                <div className="row">
                    <section className="col-lg-12 connectedSortable">

                        <PersonModal
                            isOpen={openModal}
                            hideModal={() => setOpenModal(false)}
                            onSelected={(person) => {
                                console.log(person);
                                setPersonSelected(person);
                                // handleModalSelectedData(person, formik.setFieldValue)
                            }}
                        />

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className="fas fa-hospital-user"></i>
                                    ตารางเวร
                                </h3>
                            </div>{/* <!-- /.card-header --> */}

                            <form action="" method="POST">
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
                                                className="form-control"
                                                id="depart"
                                                name="depart"
                                                onChange={(e) => onDepartChange(e.target.value)}
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
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>งาน :</label>
                                            <select
                                                className="form-control"
                                                id="division"
                                                name="division"
                                                onChange={() => {
                                                    // onDivisionChange(newScheduling.division)
                                                }}
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
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>ประจำเดือน :</label>
                                            <DatePicker
                                                selected={month}
                                                onChange={(date) => {
                                                    setMonth(date);
                                                    setDatesOfMonth(date);
                                                }}
                                                dateFormat="MM/yyyy"
                                                locale="th"
                                                showMonthYearPicker
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>ปีงบประมาณ :</label>
                                            <DatePicker
                                                selected={year}
                                                onChange={(date) => setYear(date)}
                                                dateFormat="yyyy"
                                                locale="th"
                                                showYearPicker
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>ผู้ควบคุม :</label>
                                            <select
                                                id="controller"
                                                name="controller"
                                                className="form-control">
                                                <option value="">-- เลือกผู้ควบคุม --</option>
                                                {divisionMembers && divisionMembers.map(person => {
                                                    return (
                                                        <option value={ person.person_id }>
                                                            { person.person_firstname+ ' ' +person.person_lastname }
                                                        </option>
                                                    );
                                                })}
                                            </select>
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
                                                            <input type="hidden" id="" name="" />
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
                                                {[...Array(tableCol)].map((m, i) => {
                                                    return (
                                                        <td
                                                            key={i}
                                                            style={
                                                                { textAlign: 'center', fontSize: 'small', padding: '0' }
                                                            }
                                                        >
                                                            <input
                                                                type="hidden"
                                                                id="{{ '_1_' +date }}"
                                                                name="{{ person.person_id+ '_1_' +date }}"
                                                                value="-"
                                                            />
                                                            <ShiftInput />

                                                            <input
                                                                type="hidden"
                                                                id="{{ person.person_id+ '_2_' +date }}"
                                                                name="{{ person.person_id+ '_2_' +date }}"
                                                                value="-"
                                                            />
                                                            <ShiftInput />

                                                            <input
                                                                type="hidden"
                                                                id="{{ person.person_id+ '_3_' +date }}"
                                                                name="{{ person.person_id+ '_3_' +date }}"
                                                                value="-"
                                                            />
                                                            <ShiftInput />
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
                                            
                                            { /** TODO: render new row */ }
                                            {renderAddedRow()}
                                        </tbody>
                                    </table>

                                </div>{/* <!-- /.card-body --> */}
                                <div className="card-footer clearfix">
                                    <button type="reset" className="btn btn-danger float-right">ยกเลิก</button>
                                    <button ng-click="store($event)" className="btn btn-primary float-right mr-2">บันทึก</button>
                                </div>
                                {/* <!-- /.card-footer --> */}
                            </form>
                        </div>{/* <!-- /.card --> */}
            
                    </section>
                </div>
                {/* <!-- Main row --> */}
            </div>
            {/* <!-- /.container-fluid--> */}
        </section>
    );
}

export default ScheduleAdd;
