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
    const [workingDays, setWorkingDays] = useState(0);

    const { id } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const schedule = useSelector(state => getScheduleById(state, id));
    const { scheduleDetails } = useSelector(state => state.scheduleDetails);

    useEffect(() => {
        /** To redirect to /schedules/list if schedule is null */
        if (!schedule) {
            history.push('/schedules/list');
        }

        dispatch(fetchAll(id));

        getHolidays();
        getHeadOfFaction();
    }, []);

    const getHolidays = async function () {
        try {
            const res = await api.get(`/holidays`);

            const holidayOfMonth = res.data.holidays.filter(hd => {
                return moment(hd.holiday_date).format('YYYY-MM') == moment(schedule.month).format('YYYY-MM');
            });
    
            const days = moment(schedule.month).endOf('month').date();

            setHolidays(res.data.holidays);
            setDaysOfMonth(days);
            setWorkingDays(days - holidayOfMonth.length);
        } catch (err) {
            console.log(err);
        }
    };

    const getHeadOfFaction = async function () {
        try {
            const res = await api.get(`/factions/5/head-of`);

            setHeadOfFaction(res.data.person)
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
                        workingDays={workingDays}
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
                                    <h2>ตารางปฏิบัติงานในและนอกเวลาราชการ</h2>
                                </div>
                                <div className="col-md-4">
                                    หน่วยงาน : {schedule && schedule.division
                                                            ? schedule?.division?.ward_name
                                                            : schedule?.depart?.depart_name}
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
                                            <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">
                                                วันทำการ { workingDays } วัน
                                            </td>
                                            <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">OT</td>
                                            <td style={{ width: '6%', textAlign: 'center' }} rowSpan="2">Actions</td>
                                        </tr>
                                        <DailyColumns
                                            month={schedule ? schedule.month : moment().format('YYYY-MM')}
                                            holidays={holidays}
                                            cols={daysOfMonth}
                                        />
                                    </thead>
                                    {/* TODO: Duplicated code */}
                                    <tbody>
                                        {scheduleDetails && scheduleDetails.map((row, index) => {
                                            let otShifts = row.ot_shifts ? row.ot_shifts.split(',') : [];

                                            return (
                                                <tr key={row.id}>
                                                    <td>
                                                        <span>{index+1}.</span>
                                                        <span>{ row.person.prefix.prefix_name+row.person.person_firstname+ ' ' +row.person.person_lastname }</span>
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
                                                            {row.working > 0  ? row.ot : 'OT'}
                                                        </a>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <div className="btn-group btn-group-sm" role="group" aria-label="...">
                                                            <a
                                                                href="#"
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => {
                                                                    setPersonSchedule(row);
                                                                    setOpenOtModal(true);
                                                                }}
                                                            >
                                                                OT
                                                            </a>
                                                            <Link to={`/person-shifts/${row.id}/detail`} className="btn bg-maroon">
                                                                <i className="fas fa-search"></i>
                                                            </Link>
                                                        </div>
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
                                        {schedule && schedule.controller.prefix.prefix_name+schedule.controller.person_firstname+ ' ' +schedule.controller.person_lastname}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    หัวหน้ากลุ่มภารกิจ
                                    <p style={{ fontSize: '14px', color: 'grey' }}>
                                        {headOfFaction && headOfFaction.prefix.prefix_name+headOfFaction.person_firstname+ ' ' +headOfFaction.person_lastname}
                                    </p>
                                </div>
                            </div>

                        </div>{/* <!-- /.card-body --> */}
                        <div className="card-footer clearfix text-center">
                            <Link to={`/schedules/${id}/1/pdf`} className="btn btn-success mr-2">
                                <i className="fas fa-print"></i>
                                <span className="ml-1">พิมพ์ตารางขอขึ้น</span>
                            </Link>
                            <Link to={`/schedules/${id}/2/pdf`} className="btn bg-maroon mr-2">
                                <i className="fas fa-print"></i>
                                <span className="ml-1">พิมพ์หลักฐานเบิก (OT)</span>
                            </Link>
                            <Link to={`/schedules/${id}/3/pdf`} className="btn bg-purple mr-2">
                                <i className="fas fa-print"></i>
                                <span className="ml-1">พิมพ์หลักฐานเบิก (บ่าย-ดึก)</span>
                            </Link>
                            <Link to={`/schedules/${id}/14/pdf`} className="btn bg-navy">
                                <i className="fas fa-print"></i>
                                <span className="ml-1">พิมพ์ใบลงชื่อปฏิบัติงาน</span>
                            </Link>
                        </div>{/* <!-- /.card-footer --> */}
                    </div>{/* <!-- /.card --> */}
        
                </section>
            </div>{/* <!-- Main row --> */}
        </div>
    );
}

export default ScheduleDetail;
