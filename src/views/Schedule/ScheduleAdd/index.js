import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../../api';
import { getSchedulesSuccess } from '../../../features/schedule';

const initFactions = [
    { faction_id: 1, faction_name: 'กลุ่มภารกิจด้านการพยาบาล' },
];

const initDeparts = [
    { depart_id: 1, depart_name: 'สำนักงานกลุ่มการพยาบาล' },
];

const initDivisions = [
    { ward_id: 1, ward_name: 'สำนักงานกลุ่มการพยาบาล' },
];

const dataTableOptions = {
    totalCol: 31,
};

const ScheduleAdd = () => {
    const [factions, setFactions] = useState(initFactions);
    const [departs, setDeparts] = useState(initDeparts);
    const [divisions, setDivisions] = useState(initDivisions);
    const [divisionMembers, setDivisionMembers] = useState([]);
    const shifts = [];
    const pager = null;

    const dispatch = useDispatch();
    const schedules = useSelector(state => state.schedule.schedules);

    const onDepartChange = function (e) {
        console.log(e);
    };

    const onDivisionChange = function (e) {
        console.log(e);
    };

    const getSchedules = async function (e) {
        console.log(e);
        
        try {
            const res = await api.get('/api/schedulings');
            console.log(res);

            dispatch(getSchedulesSuccess(res.data.schedulings));
        } catch (error) {
            console.log(error);
        }
    };

    const onPaginateLinkClick = function (e, pageUrl) {
        console.log(e, pageUrl);
    };

    useEffect(() => {
        getSchedules();
    }, []);

    console.log(schedules);
    return (
        <section className="content">
            <div className="container-fluid">
                {/* <!-- Main row --> */}
                <div className="row">
                    <section className="col-lg-12 connectedSortable">

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
                                                onChange={() => {
                                                        // onFactionChange(newScheduling.faction)
                                                }}
                                            >
                                                <option value="">-- เลือกกลุ่มภารกิจ --</option>
                                                {factions && factions.map(fac => {
                                                    return (
                                                        <option value={ fac.faction_id }>
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
                                                onChange={() => {
                                                    // onDepartChange(newScheduling.depart)
                                                }}
                                            >
                                                <option value="">-- เลือกกลุ่มงาน --</option>
                                                {departs && departs.map(dep => {
                                                    return (
                                                        <option value={ dep.depart_id }>
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
                                                        <option value={ div.ward_id }>
                                                            { div.ward_name }
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>ประจำเดือน :</label>
                                            <input
                                                type="text"
                                                id="month"
                                                name="month"
                                                className="form-control"
                                                autocomplete="off"
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>ปีงบประมาณ :</label>
                                            <input
                                                type="text"
                                                id="year"
                                                name="year"
                                                className="form-control"
                                                autocomplete="off"
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
                                                <td style={{ textAlign: 'center' }} colSpan={ dataTableOptions.totalCol }>
                                                    วันที่
                                                </td>
                                                <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">รวม</td>
                                                <td style={{ width: '5%', textAlign: 'center' }} rowSpan="2">Actions</td>
                                            </tr>
                                            <tr>
                                                {[...Array(dataTableOptions.totalCol)].map((m, i) => {
                                                    return (
                                                        <td style={{ width: '2.5%', textAlign: 'center', fontSize: 'small' }}>
                                                            { i + 1 }
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {divisionMembers && divisionMembers.map(person => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            { person.person_firstname+ ' ' +person.person_lastname }
                                                            <p style={{ color: 'grey', margin: '0px' }}>
                                                                ตำแหน่ง ...
                                                            </p>
                                                        </td>
                                                        {[...Array(dataTableOptions.totalCol)].map((m, i) => {
                                                            return (
                                                                <td style={{ width: '2.5%', textAlign: 'center', fontSize: 'small' }}>
                                                                    <input
                                                                        type="hidden"
                                                                        id="{{ person.person_id+ '_1_' +date }}"
                                                                        name="{{ person.person_id+ '_1_' +date }}"
                                                                        value="-"
                                                                    />
                                                                    <div className="btn-group mt-2" role="group">
                                                                        <button
                                                                            type="button"
                                                                            id="{{ person.person_id+ '_1_' +date+ '_btnGroupDrop' }}"
                                                                            className="btn btn-default btn-xs dropdown-toggle"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <div
                                                                            className="dropdown-menu dropdown-menu-right" 
                                                                            aria-labelledby="{{ person.person_id+ '_1_' +date+ '_btnGroupDrop' }}"
                                                                            style={{ minWidth: '4rem' }}
                                                                        >
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, '-', person.person_id+ '_1_' +date)">
                                                                                -
                                                                            </a>
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, 'ด', person.person_id+ '_1_' +date)">
                                                                                ด
                                                                            </a>
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, 'ช', person.person_id+ '_1_' +date)">
                                                                                ช
                                                                            </a>
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, 'บ', person.person_id+ '_1_' +date)">
                                                                                บ
                                                                            </a>
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, 'BD', person.person_id+ '_1_' +date)">
                                                                                BD
                                                                            </a>
                                                                        </div>
                                                                    </div>

                                                                    <input
                                                                        type="hidden"
                                                                        id="{{ person.person_id+ '_2_' +date }}"
                                                                        name="{{ person.person_id+ '_2_' +date }}"
                                                                        value="-"
                                                                    />
                                                                    <div className="btn-group mt-2" role="group">
                                                                        <button
                                                                            type="button"
                                                                            id="{{ person.person_id+ '_2_' +date+ '_btnGroupDrop' }}"
                                                                            className="btn btn-default btn-xs dropdown-toggle"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <div
                                                                            className="dropdown-menu dropdown-menu-right" 
                                                                            aria-labelledby="{{ person.person_id+ '_2_' +date+ '_btnGroupDrop' }}"
                                                                            style={{ minWidth: '4rem' }}
                                                                        >
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, '-', person.person_id+ '_2_' +date)">
                                                                                -
                                                                            </a>
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, 'ด', person.person_id+ '_2_' +date)">
                                                                                ด
                                                                            </a>
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, 'ช', person.person_id+ '_2_' +date)">
                                                                                ช
                                                                            </a>
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, 'บ', person.person_id+ '_2_' +date)">
                                                                                บ
                                                                            </a>
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, 'BD', person.person_id+ '_2_' +date)">
                                                                                BD
                                                                            </a>
                                                                        </div>
                                                                    </div>

                                                                    <input
                                                                        type="hidden"
                                                                        id="{{ person.person_id+ '_3_' +date }}"
                                                                        name="{{ person.person_id+ '_3_' +date }}"
                                                                        value="-"
                                                                    />
                                                                    <div className="btn-group mt-2" role="group">
                                                                        <button
                                                                            type="button"
                                                                            id="{{ person.person_id+ '_3_' +date+ '_btnGroupDrop' }}"
                                                                            className="btn btn-default btn-xs dropdown-toggle"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <div
                                                                            className="dropdown-menu dropdown-menu-right" 
                                                                            aria-labelledby="{{ person.person_id+ '_3_' +date+ '_btnGroupDrop' }}"
                                                                            style={{ minWidth: '4rem' }}
                                                                        >
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, '-', person.person_id+ '_3_' +date)">
                                                                                -
                                                                            </a>
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, 'ด', person.person_id+ '_3_' +date)">
                                                                                ด
                                                                            </a>
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, 'ช', person.person_id+ '_3_' +date)">
                                                                                ช
                                                                            </a>
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, 'บ', person.person_id+ '_3_' +date)">
                                                                                บ
                                                                            </a>
                                                                            <a href="#" className="dropdown-item" ng-click="onSelectedShift($event, 'BD', person.person_id+ '_3_' +date)">
                                                                                BD
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                        <td>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span>ด=</span>
                                                                <span>ช=</span>
                                                                <span>บ=</span>
                                                                <span>BD=</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <a 
                                                                href="#"
                                                                className="btn btn-primary btn-sm" 
                                                                onClick={(e) => {
                                                                    // onAddShift(e, person.person_id)
                                                                }}
                                                            >
                                                                เพิ่ม
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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
