import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import api from '../../api';

const ShiftSwappingList = () => {
    /** Global states */
    const { user } = useSelector(state => state.users);
    console.log(user);

    /** Local states */
    const [swappings, setSwappings] = useState([]);
    const [pager, setPager] = useState(null);

    useEffect(() => {
        fetchSwaps();
    }, []);
    
    const fetchSwaps = async () => {
        const res = await api.get('/swappings');

        const { data, ...pager } = res.data.swappings

        setSwappings(data);
        setPager(pager);
    };

    const onPaginateLinkClick = () => {

    };

    console.log(swappings);

    return (
        <div className="container-fluid">
            {/* <!-- Main row --> */}
            <div className="row">
                <section className="col-lg-12 connectedSortable">

                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <i className="fas fa-hospital-user mr-1"></i>
                                รายการอนุมัติเวร
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
                                        <th style={{ textAlign: 'center' }}>รายการขออนุมัติ</th>
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
                                                    <div>
                                                        <span>
                                                            {`${swapping.owner?.person?.person_firstname} ${swapping.owner?.person?.person_lastname}`}
                                                        </span>
                                                        <span className="mx-2">
                                                            ซึ่งปฏิบัติ เวร {swapping.owner_shift} ในวันที่ {moment(swapping.owner_date).format('DD/MM/YYYY')}
                                                        </span>
                                                        <span>
                                                            เนื่องจาก {swapping.reason}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="mr-2">จึงมอบหมายให้</span>
                                                        <span>
                                                            {`${swapping.delegator?.person?.person_firstname} ${swapping.delegator?.person?.person_lastname}`}
                                                        </span>
                                                        {swapping.no_swap === 0 ? (
                                                            <span className="mx-2">
                                                                โดยจะขึ้นปฏิบัติแทน เวร {swapping.swap_shift} ในวันที่ {moment(swapping.swap_date).format('DD/MM/YYYY')}
                                                            </span>
                                                        ) : (
                                                            <span className="mx-2">
                                                                โดยไม่ขึ้นปฏิบัติแทน
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>{swapping.status}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <a href="#" className="btn btn-primary btn-sm">
                                                        อนุมัติ
                                                    </a>
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
                                    <a href="#" className="btn btn-success btn-sm">Excel</a>
                                </div>
                                
                                <div className="col-4 m-0" style={{ textAlign: 'center' }}>
                                    <span>จำนวนทั้งหมด { pager && pager?.total } ราย</span>
                                </div>
                                
                                <div className="col-4 m-0">
                                    {pager && (
                                        <ul className="pagination pagination-sm m-0 float-right">
                                            <li className={ `page-item ${pager.current_page == 1 ? 'disabled' : '' }`}>
                                                <a className="page-link" href="#" onClick={ (e) => onPaginateLinkClick(e, pager.first_page_url) }>
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
    )
}

export default ShiftSwappingList;
