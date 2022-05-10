import React, { useEffect, useState } from 'react';
import api from '../../../api';

const ShiftOff = () => {
    const [offs, setOffs] = useState([]);
    const [pager, setPager] = useState([]);

    useEffect(() => {
        fetchOffs();
    }, []);

    const fetchOffs = async () => {
        const res = await api.get(`/shift-offs`);
        console.log(res);
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
                                        <th style={{ width: '15%', textAlign: 'center' }}>ผู้ขอ</th>
                                        <th style={{ textAlign: 'center' }}>รายการขออนุมัติ</th>
                                        <th style={{ width: '15%', textAlign: 'center' }}>ผู้รับมอบ</th>
                                        <th style={{ width: '8%', textAlign: 'center' }}>สถานะ</th>
                                        <th style={{ width: '8%', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {swappings && swappings.map((swapping, index) => {
                                        return (
                                            <tr key={swapping.id}>
                                                <td style={{ textAlign: 'center' }}>{index+1}</td>
                                                <td>
                                                    {`${swapping.owner?.person?.person_firstname} ${swapping.owner?.person?.person_lastname}`}
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>
                                                            วันที่ {moment(swapping.owner_date).format('DD/MM/YYYY')} / เวร {swapping.owner_shift}
                                                        </span>
                                                        <p className="m-0">
                                                            <span>
                                                                เนื่องจาก {swapping.reason}
                                                            </span>
                                                            {swapping.no_swap === 0 ? (
                                                                <span className="mx-2">
                                                                    โดยจะขึ้นปฏิบัติแทนในวันที่ {moment(swapping.swap_date).format('DD/MM/YYYY')} / เวร {swapping.swap_shift}
                                                                </span>
                                                            ) : (
                                                                <span className="mx-2">
                                                                    โดยไม่ขึ้นปฏิบัติแทน
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>
                                                    {`${swapping.delegator?.person?.person_firstname} ${swapping.delegator?.person?.person_lastname}`}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <span className={`btn btn-xs ${swapping.status == 'REQUESTED' ? 'bg-maroon' : 'bg-green'}`}>
                                                        {swapping.status}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div className="btn-group btn-group-sm" role="group" aria-label="...">
                                                        <a href="#" className="btn btn-success" onClick={(e) => console.log(e, swapping)}>
                                                            <i className="fas fa-print"></i>
                                                        </a>

                                                        {swapping.status == 'REQUESTED' ? (
                                                            <a href="#" className="btn btn-primary" onClick={(e) => handleApprovement(e, swapping)}>
                                                                อนุมัติ
                                                            </a>
                                                        ) : (
                                                            <a href="#" className="btn btn-danger" onClick={(e) => console.log(e, swapping)}>
                                                                ยกเลิก
                                                            </a>
                                                        )}
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

export default ShiftOff;