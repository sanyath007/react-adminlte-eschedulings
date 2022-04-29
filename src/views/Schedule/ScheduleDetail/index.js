import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import api from '../../../api';
import { getScheduleById } from '../../../features/schedules';
import { fetchAll } from '../../../features/scheduleDetails';
import DailyColumns from '../../../components/DailyColumns';
import ShiftsOfDay from '../../../components/ShiftsOfDay';
import MonthlyText from '../../../components/MonthlyText';
import OtModal from '../../Modals/OtModal';
import ShiftModal from '../../Modals/ShiftModal';
import './styles.css';

const ScheduleDetail = () => {
    const [daysOfMonth, setDaysOfMonth] = useState(31);
    const [holidays, setHolidays] = useState([]);
    const [headOfFaction, setHeadOfFaction] = useState(null);
    const [openOtModal, setOpenOtModal] = useState(false);
    const [openShiftModal, setOpenShiftModal] = useState(false);
    const [personSchedule, setPersonSchedule] = useState(null);
    const [shift, setshift] = useState('');

    const { id } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const schedule = useSelector(state => getScheduleById(state, id));

    useEffect(() => {
        dispatch(fetchAll(id));

        getHolidays();
        getHeadOfFaction();

        /** To redirect to /schedules/list if schedule is null */
        if (!schedule) {
            history.push('/schedules/list');
        } else {
            setDaysOfMonth(moment(schedule.month).endOf('month').date());
        }
    }, []);

    const getHolidays = async function () {
        try {
            const res = await api.get(`/api/holidays`);

            setHolidays(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getHeadOfFaction = async function () {
        try {
            const res = await api.get(`/api/persons/head-of/faction/5`);

            setHeadOfFaction(res.data)
        } catch (err) {
            console.log(err);
        }
    };

    const handleShiftClicked = (shiftId, shiftText, date) => {
        setshift({ shiftId ,shiftDate: `${schedule.month}-${date}`, shiftText });

        setOpenShiftModal(true);
    };

    return (
        <div className="container-fluid">
            {/* <!-- Main row --> */}
            <div className="row">
                <section className="col-lg-12 connectedSortable">

                    <OtModal
                        isOpen={openOtModal}
                        hideModal={() => setOpenOtModal(false)}
                        schedule={personSchedule}
                        month={schedule ? schedule.month : moment().format('YYYY-MM')}
                        holidays={holidays}
                    />

                    <ShiftModal
                        isOpen={openShiftModal}
                        hideModal={() => setOpenShiftModal(false)}
                        personShifts={personSchedule}
                        shift={shift}
                    />

                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <i className="fas fa-hospital-user mr-1"></i>
                                รายละเอียดตารางเวร
                            </h3>
                        </div>{/* <!-- /.card-header --> */}
                        {/* <div className="card-body"></div><!-- /.card-body --> */}
                    </div>{/* <!-- /.card --> */}

                    <div className="card">
                        <div className="card-body">
                            <div className="row my-2">
                                <div className="col-md-12 text-center">
                                    <h2>ตารางปฏิบัติงานนอกเวลาราชการ</h2>
                                </div>
                                <div className="col-md-4">
                                    หน่วยงาน : {schedule && schedule.division.ward_name}
                                </div>
                                <div className="col-md-4">
                                    ประจำเดือน : {schedule && <MonthlyText monthText={schedule.month} /> }
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered table-striped mb-1" style={{ fontSize: '14px' }}>
                                    {/* TODO: Duplicated code */}
                                    <thead>
                                        <tr>
                                            <td style={{ textAlign: 'center' }} rowSpan="2">ชื่อ-สกุล</td>
                                            <td style={{ textAlign: 'center' }} colSpan={ daysOfMonth }>วันที่</td>
                                            <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">วันทำการ</td>
                                            <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">OT</td>
                                            <td style={{ width: '5%', textAlign: 'center' }} rowSpan="2">Actions</td>
                                        </tr>
                                        <DailyColumns
                                            month={schedule ? schedule.month : moment().format('YYYY-MM')}
                                            holidays={holidays}
                                        />
                                    </thead>
                                    {/* TODO: Duplicated code */}
                                    <tbody>
                                        {schedule && schedule.shifts.map(row => {
                                            let otShifts = row.ot_shifts ? row.ot_shifts.split(',') : [];

                                            return (
                                                <tr key={row.id}>
                                                    <td>
                                                        { row.person.prefix.prefix_name+row.person.person_firstname+ ' ' +row.person.person_lastname }
                                                        <p style={{ color: 'grey', margin: '0px' }}>
                                                            {row.person.position.position_name}
                                                        </p>
                                                    </td>
                                                    {row.shifts.split(',').map((shift, index) => {
                                                        return (
                                                            <td key={index} style={{ textAlign: 'center', fontSize: 'small', padding: '0px' }}>
                                                                <ShiftsOfDay
                                                                    shifts={ shift }
                                                                    otShift={otShifts.length > 0 ? otShifts[index] : ''}
                                                                    onClick={(shiftText) => {
                                                                        setPersonSchedule(row);
                                                                        handleShiftClicked(row.id, shiftText, index+1);
                                                                    }}
                                                                />
                                                            </td>
                                                        );
                                                    })}
                                                    <td style={{ textAlign: 'center' }}>
                                                        <span className="text-btn outline-danger btn-sm">
                                                            {row.working > 0 ? row.working : row.total}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <a
                                                            href="#"
                                                            className="btn btn-outline-danger btn-sm"
                                                        >
                                                            {row.ot ? row.ot : 'OT'}
                                                        </a>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <a
                                                            href="#"
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => {
                                                                setPersonSchedule(row);
                                                                setOpenOtModal(true);
                                                            }}
                                                        >
                                                            วัน OT
                                                        </a>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="row">
                                <div className="col-md-12" style={{ fontSize: '14px', color: 'red' }}>
                                    { schedule && schedule.remark }
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-6">
                                    หัวหน้ากลุ่มงาน
                                    <p style={{ fontSize: '14px', color: 'grey' }}>
                                        {schedule && schedule.controller.person_firstname+ ' ' +schedule.controller.person_lastname}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    หัวหน้ากลุ่มภารกิจ
                                    <p style={{ fontSize: '14px', color: 'grey' }}>
                                        {headOfFaction && headOfFaction.person_firstname+ ' ' +headOfFaction.person_lastname}
                                    </p>
                                </div>
                            </div>

                        </div>{/* <!-- /.card-body --> */}
                        <div className="card-footer clearfix text-center">
                            <a href="" className="btn btn-success">
                                <i class="fas fa-print"></i>
                                <span className="ml-1">พิมพ์ตารางเวร</span>
                            </a>
                        </div>{/* <!-- /.card-footer --> */}
                    </div>{/* <!-- /.card --> */}
        
                </section>
            </div>{/* <!-- Main row --> */}
        </div>
    );
}

export default ScheduleDetail;
