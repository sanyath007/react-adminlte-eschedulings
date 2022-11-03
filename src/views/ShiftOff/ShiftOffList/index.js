import React, { useEffect, useState } from 'react';
import moment from 'moment';
import api from '../../../api';
import MonthlyText from '../../../components/MonthlyText';

const ShiftOffList = () => {
    const [offs, setOffs] = useState([]);
    const [pager, setPager] = useState([]);

    useEffect(() => {
        fetchOffs();
    }, []);

    const fetchOffs = async (url='/shift-offs?page=') => {
        const res = await api.get(`${url}`);
        const { data, ...pager } = res.data.offs;

        setOffs(data);
        setPager(pager);
    };

    const onPaginateLinkClick = (e, url) => {
        fetchOffs(url);
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
                                รายการ Off เวร
                            </h3>
                        </div>
                        <div className="card-body pb-1">

                        </div>{/* <!-- /.card-body --> */}
                    </div>{/* <!-- /.card --> */}

                    <div className="card">
                        <div className="card-body">

                            <table className="table table-bordered table-striped" style={{ fontSize: '14px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '4%', textAlign: 'center' }}>#</th>
                                        <th style={{ width: '15%', textAlign: 'center' }}>ผู้ปฏิบัติงาน</th>
                                        <th style={{ textAlign: 'center' }}>รายละเอียด</th>
                                        <th style={{ width: '8%', textAlign: 'center' }}>สถานะ</th>
                                        <th style={{ width: '8%', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offs && offs.map((off, index) => {
                                        const { detail, schedule, ...other } = off;

                                        if (detail && schedule) {
                                            return (
                                                <tr key={off.id}>
                                                    <td style={{ textAlign: 'center' }}>{index+1}</td>
                                                    <td>
                                                        {`${detail?.person?.person_firstname} ${detail?.person?.person_lastname}`}
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <span>
                                                                วันที่ {moment(off.shift_date).format('DD/MM/YYYY')} / เวร {off.shift}
                                                            </span>
                                                            <span className="ml-2">
                                                                ประจำเดือน <MonthlyText monthText={schedule.month} />
                                                            </span>
                                                            <p className="m-0">
                                                                เนื่องจาก {off.reason}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <span className={`btn btn-xs ${off.status == 'REQUESTED' ? 'bg-maroon' : 'bg-green'}`}>
                                                            {off.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <div className="btn-group btn-group-sm" role="group" aria-label="...">
                                                            {/* <a href="#" className="btn btn-success" onClick={(e) => console.log(e, off)}>
                                                                <i className="fas fa-print"></i>
                                                            </a> */}
                                                            <a href="#" className="btn btn-danger" onClick={(e) => console.log(e, off)}>
                                                                ยกเลิก
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        } else {
                                            return (
                                                <tr>
                                                    <td colSpan="6" style={{ textAlign: 'center' }}>
                                                        -- ไม่พบข้อมูล --
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table>

                        </div>{/* <!-- /.card-body --> */}
                        <div className="card-footer clearfix">
                            <div className="row">
                                <div className="col-4 m-0 float-left">
                                    {/* <a href="#" className="btn btn-success btn-sm">Excel</a> */}
                                </div>
                                
                                <div className="col-4 m-0" style={{ textAlign: 'center' }}>
                                    <span>จำนวนทั้งหมด { pager && pager?.total } ราย</span>
                                </div>
                                
                                <div className="col-4 m-0">
                                    {pager && (
                                        <ul className="pagination pagination-sm m-0 float-right">
                                            <li className={ `page-item ${pager.current_page == 1 ? 'disabled' : '' }`}>
                                                <a className="page-link" href="#" onClick={ (e) => onPaginateLinkClick(e, pager.path+ '?page=1') }>
                                                    First
                                                </a>
                                            </li>
                                            <li className={ `page-item ${pager.current_page == 1 ? 'disabled' : '' }`}>
                                                <a className="page-link" href="#" onClick={ (e) => onPaginateLinkClick(e, pager.prev_page_url) }>
                                                    Prev
                                                </a>
                                            </li>
                                            <li className={ `page-item ${pager.current_page == pager.last_page ? 'disabled' : '' }`}>
                                                <a className="page-link" href="#" onClick={ (e) => onPaginateLinkClick(e, pager.next_page_url) }>
                                                    Next
                                                </a>
                                            </li>
                                            <li className={ `page-item ${pager.current_page == pager.last_page ? 'disabled' : '' }`}>
                                                <a className="page-link" href="#" onClick={ (e) => onPaginateLinkClick(e, pager.path+ '?page=' +pager.last_page) }>
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
    );
};

export default ShiftOffList;