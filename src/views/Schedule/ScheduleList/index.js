import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../../api';
import { getSchedulesSuccess } from '../../../features/schedule';

const ScheduleList = () => {
    const [departs, setDeparts] = useState([]);
    const [divisions, setDivisions] = useState([]);
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

                                    <button onClick={ (e) => getSchedules(e) } className="btn btn-primary">ตกลง</button>
                                </form>

                            </div>{/* <!-- /.card-body --> */}
                        </div>{/* <!-- /.card --> */}

                        <div className="card">
                            <div className="card-body">
                                <div className="row my-2">
                                    <div className="col-md-12">
                                        <Link to="/schedules/add" className="btn btn-primary float-right">
                                            เพิ่มตารางเวร
                                        </Link>
                                    </div>
                                </div>

                                <table className="table table-bordered table-striped" style={{ fontSize: '14px' }}>
                                    <thead>
                                        <tr>
                                            <td style={{ width: '3%', textAlign: 'center' }}>ลำดับ</td>
                                            <td style={{ textAlign: 'center' }}>หน่วยงาน</td>
                                            <td style={{ width: '15%', textAlign: 'center' }}>ประจำเดือน</td>
                                            <td style={{ width: '8%', textAlign: 'center' }}>จำนวน<br />ผู้ปฏิบัติงาน</td>
                                            <td style={{ width: '8%', textAlign: 'center' }}>จำนวนเวร</td>
                                            <td style={{ width: '10%', textAlign: 'center' }}>Actions</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules && schedules.map((row, i) => {
                                            return (
                                                <tr key={row.id}>
                                                    <td style={{ textAlign: 'center' }}>{ i+1 }</td>
                                                    <td>{ row.division.ward_name }</td>
                                                    <td style={{ textAlign: 'center' }}>{ row.month } / { row.year }</td>
                                                    <td style={{ textAlign: 'center' }}>{ row.month }</td>
                                                    <td style={{ textAlign: 'center' }}>{ row.month }</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <div className="btn-group btn-group-sm" role="group" aria-label="...">
                                                            <Link to={ `/schedules/${row.id}/detail` } className="btn btn-info">
                                                                <i className="fas fa-search"></i>
                                                            </Link>
                                                            <Link to="/schedules/edit" className="btn btn-warning">
                                                                <i className="fas fa-edit"></i>
                                                            </Link>
                                                            <a href="#" className="btn btn-danger">
                                                                <i className="far fa-trash-alt"></i>
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                            </div>{/* <!-- /.card-body --> */}
                            <div className="card-footer clearfix">
                                <div className="row">
                                    {/* <div className="col-3 m-0 float-left">
                                        <a href="#" className="btn btn-success btn-sm">Excel</a>
                                    </div> */}
                                    
                                    <div className="col-6 m-0" style={{ textAlign: 'center' }}>
                                        <span>จำนวนทั้งหมด { pager && pager.total } ราย</span>
                                    </div>
                                    
                                    <div className="col-3 m-0">
                                        {pager && (
                                            <ul className="pagination pagination-md m-0 float-right">
                                                <li className="page-item" ng-className="{disabled: pager.current_page==1}">
                                                    <a className="page-link" href="#" onClick={ (e) => onPaginateLinkClick(e, pager.first_page_url) }>
                                                        First
                                                    </a>
                                                </li>
                                                <li className="page-item" ng-className="{disabled: pager.current_page==1}">
                                                    <a className="page-link" href="#" onClick={ (e) => onPaginateLinkClick(e, pager.prev_page_url) }>
                                                        Prev
                                                    </a>
                                                </li>
                                                <li className="page-item" ng-className="{disabled: pager.current_page==pager.last_page}">
                                                    <a className="page-link" href="#" onClick={ (e) => onPaginateLinkClick(e, pager.next_page_url) }>
                                                        Next
                                                    </a>
                                                </li>
                                                <li className="page-item" ng-className="{disabled: pager.current_page==pager.last_page}">
                                                    <a className="page-link" href="#" onClick={ (e) => onPaginateLinkClick(e, pager.last_page_url) }>
                                                        Last
                                                    </a>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* <!-- /.card-footer --> */}
                        </div>
                        {/* <!-- /.card --> */}
            
                    </section>
                </div>
                {/* <!-- Main row --> */}
            </div>
            {/* <!-- /.container-fluid--> */}
        </section>
    );
}

export default ScheduleList;
