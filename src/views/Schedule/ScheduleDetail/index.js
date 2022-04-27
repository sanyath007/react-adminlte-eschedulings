import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import api from '../../../api';
import { getScheduleById } from '../../../features/schedules';
import { fetchAll } from '../../../features/scheduleDetails';
import DailyColumns from '../../../components/DailyColumns';
import ShiftsOfDay from '../../../components/ShiftsOfDay';
import MonthlyText from '../../../components/MonthlyText';

const ScheduleDetail = () => {
    const dataTableOptions = { totalCol: 31 };
    const [holidays, setHolidays] = useState([]);
    const [headOfFaction, setHeadOfFaction] = useState(null);
    const [ot, setOt] = useState([]);

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

    const handleOnSetOT = (scheduleDetail, date, shift, isOt) => {
        const { id, person_id, ...other } = scheduleDetail;
        const personOt = ot.find(o => o.id === id);

        if (personOt) {
            const newPersonOt = personOt.shifts.map((sh, i) => {
                if (i+1 === date) {
                    return sh = isOt ? shift : '';
                }

                return sh;
            });

            const newOt = ot.map(o => {
                if (o.id === id) {
                    o.shifts = newPersonOt;
                }

                return o;
            });

            setOt(newOt);
        } else {
            let newShifts = scheduleDetail.shifts.split(',').map((sh, i) => {
                if (i+1 === date) {
                    return isOt ? shift : '';
                }
    
                return sh = '';
            });
    
            const newOt = [...ot, { id, person_id, shifts: newShifts }];

            setOt(newOt);
        }
    };

    const handleSubmitOT = async (id, totalShift, OT) => {
        console.log(id, parseFloat(totalShift, 10), OT);
        const data = { total_shift: parseFloat(totalShift, 10), ot: OT };

        let res = await api.put(`/api/schedulings/${id}/ot`, data);

        if (res.data.status === 1) {
            toast.success('บันทึกข้อมูลเรียบร้อย !!!', { autoClose: 1000, hideProgressBar: true });
        } else {
            toast.error('พบข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้ !!!', { autoClose: 1000, hideProgressBar: true });
        }
    };

    const renderTotalShift = (shifts, ot) => {
        let totalShift = 0;
        shifts.split(',').forEach((sh, index) => {
            sh.split('|').forEach(s => {
                if (s !== '') {
                    totalShift += 1;
                }
            });
        });

        let sumOT = 0;
        if (ot) {
            sumOT = ot.shifts.reduce((sum, curVal) => {
                if (curVal !== '') {
                    return sum += 1;
                }

                return sum;
            }, 0);
        }

        return <span>{totalShift - sumOT}</span>;
    };

    const renderOT = (id, totalShift, ot) => {
        let sumOT = 0;
        if (ot) {
            sumOT = ot.shifts.reduce((sum, curVal) => {
                if (curVal !== '') {
                    return sum += 1;
                }

                return sum;
            }, 0);
        }

        return (
            <a
                href="#" 
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleSubmitOT(id, totalShift, sumOT)}
            >
                {sumOT}
            </a>
        );
    };

    return (
        <div className="container-fluid">
            {/* <!-- Main row --> */}
            <div className="row">
                <section className="col-lg-12 connectedSortable">

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
                                    <thead>
                                        <tr>
                                            <td style={{ textAlign: 'center' }} rowSpan="2">ชื่อ-สกุล</td>
                                            <td style={{ textAlign: 'center' }} colSpan={ dataTableOptions.totalCol }>วันที่</td>
                                            <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">วันทำการ</td>
                                            <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">OT</td>
                                            <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">Actions</td>
                                        </tr>
                                        <DailyColumns
                                            month={schedule ? schedule.month : moment().format('YYYY-MM')}
                                            holidays={holidays}
                                        />
                                    </thead>
                                    <tbody>
                                        {schedule && schedule.shifts.map(row => {
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
                                                                    onSetOT={(sh, isOt) => {
                                                                        handleOnSetOT(row, index+1, sh, isOt)
                                                                    }}
                                                                />
                                                            </td>
                                                        );
                                                    })}
                                                    <td style={{ textAlign: 'center' }}>
                                                        {renderTotalShift(row.shifts, ot.find(o => o.id == row.id))}
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {renderOT(row.id, row.total_shift, ot.find(o => o.id == row.id))}
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <div className="btn-group btn-group-sm" role="group" aria-label="...">
                                                            <Link to={`/person-shifts/${row.id}/detail`} className="btn btn-info">
                                                                <i className="fas fa-search"></i>
                                                            </Link>
                                                            <Link to={`/person-shifts/${row.id}/edit`} className="btn btn-warning">
                                                                <i className="fas fa-edit"></i>
                                                            </Link>
                                                            <a href="#" className="btn btn-danger" onClick={(e) => console.log(e, row.id)}>
                                                                <i className="far fa-trash-alt"></i>
                                                            </a>
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
                        <div className="card-footer clearfix">
                        </div>{/* <!-- /.card-footer --> */}
                    </div>{/* <!-- /.card --> */}
        
                </section>
            </div>{/* <!-- Main row --> */}
        </div>
    );
}

export default ScheduleDetail;
