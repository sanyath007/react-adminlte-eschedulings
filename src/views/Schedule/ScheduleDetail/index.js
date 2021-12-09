import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import api from '../../../api';
import { getScheduleSuccess } from '../../../features/schedule';
import DailyColumns from '../../../components/DailyColumns'
import ShiftsOfDay from '../../../components/ShiftsOfDay'
import moment from 'moment';

const ScheduleDetail = () => {
    const departs = [];
    const divisions = [];
    const scheduling_shifts = [];
    const shifts = [];
    const dataTableOptions = {
        totalCol: 31
    };
    const [holidays, setHolidays] = useState([]);

    const { id } = useParams();
    const dispatch = useDispatch();
    const schedule = useSelector(state => state.schedule.schedule);

    const onDepartChange = function (e) {
        console.log(e);
    };

    const onDivisionChange = function (e) {
        console.log(e);
    };

    const getSchedule = async function (e) {        
        try {
            const res = await api.get(`/api/schedulings/${id}`);

            dispatch(getScheduleSuccess(res.data.scheduling));
        } catch (err) {
            console.log(err);
        }
    };

    const getHolidays = async function () {
        try {
            const res = await api.get(`/api/holidays`);

            setHolidays(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getSchedule();
        getHolidays();
    }, []);

    console.log(schedule);

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
                        <div className="card-body">

                            <form action="" method="POST" className="form-inline">
                                {/* <div className="form-group">
                                    <label>กลุ่มงาน :</label>
                                    <select
                                        className="form-control mr-2 ml-2"
                                        id="cboDepart"
                                        name="cboDepart"
                                        onChange={ (e) => onDepartChange(e) }
                                    >
                                        <option value="">-- เลือกกลุ่มงาน --</option>
                                        <option value="65">สำนักการพยาบาล</option>
                                        { departs && departs.map(dep => {
                                            return (
                                                <option value={ dep.depart_id }>
                                                    { dep.depart_name }
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>งาน :</label>
                                    <select
                                        className="form-control mr-2 ml-2"
                                        id="cboDivision"
                                        name="cboDivision"
                                        onChange={ (e) => onDivisionChange(e) }
                                    >
                                        <option value="">-- เลือกงาน --</option>
                                        { divisions && divisions.map(div => {
                                            return (
                                                <option value={ div.ward_id }>
                                                    { div.ward_name }
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div> */}
                                <div className="form-group">
                                    <label>ประจำเดือน :</label>
                                    <input
                                        type="text"
                                        id="cboMonth"
                                        name="cboMonth"
                                        className="form-control"
                                        style={{ margin: '0 10px' }}
                                        autoComplete="off"
                                    />
                                </div>

                                {/* <button onClick={ (e) => getAll(e) } className="btn btn-primary">ตกลง</button> */}
                            </form>

                        </div>{/* <!-- /.card-body --> */}
                    </div>{/* <!-- /.card --> */}

                    <div className="card">
                        <div className="card-body">
                            <div className="row my-2">
                                <div className="col-md-12 text-center">
                                    <h2>ตารางปฏิบัติงานนอกเวลาราชการ</h2>
                                </div>
                                <div className="col-md-3">
                                    หน่วยงาน : {schedule && schedule.division.ward_name}
                                </div>
                                <div className="col-md-3">
                                    ประจำเดือน : {schedule && schedule.month}
                                </div>
                            </div>
                            
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped" style={{ fontSize: '14px' }}>
                                    <thead>
                                        <tr>
                                            <td style={{ textAlign: 'center' }} rowSpan="2">ชื่อ-สกุล</td>
                                            <td style={{ textAlign: 'center' }} colSpan={ dataTableOptions.totalCol }>วันที่</td>
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
                                                                <ShiftsOfDay shifts={ shift } />
                                                            </td>
                                                        );
                                                    })}
                                                    <td style={{ textAlign: 'center' }}></td>
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
                                </div>
                                <div className="col-md-6">
                                    หัวหน้ากลุ่มภารกิจ
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
