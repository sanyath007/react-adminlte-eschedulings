import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import api from '../../../api';
import { calculateShiftsTotal } from '../../../utils';

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

    const onPaginateLinkClick = (e, url) => {
        console.log(e, url);
    };

    const updateShifts = (personShifts, request, swap) => {
        const { shifts, id, ...other } = personShifts;

        const updatedShifts = shifts.split(',').map((sh, index) => {
            if (moment(request.date).date() === index + 1) {
                sh = sh.replace('R', request.shift);
            }

            if (swap) {
                if (moment(swap.date).date() === index + 1) {
                    sh = sh.replace('D', swap.shift);
                }
            }

            return sh;
        });

        const updatedTotal = calculateShiftsTotal(updatedShifts);

        return {
            ...other,
            m: updatedTotal.morn,
            e: updatedTotal.even,
            n: updatedTotal.night,
            b: updatedTotal.bd,
            total: updatedTotal.night + updatedTotal.morn + updatedTotal.even + updatedTotal.bd,
            shifts: updatedShifts 
        };
    };

    const handleApprovement = (e, swapping) => {
        e.preventDefault();

        const { id, owner, delegator, ...other } = swapping;

        /** อัพเดตเวรของผู้ขอ */
        const ownerShifts = updateShifts(
            owner,
            { date: other.owner_date, shift: '' },
            other.no_swap === 0
                ? { date: other.swap_date, shift: other.swap_shift } 
                : null
        );

        /** อัพเดตเวรของผู้รับ */
        const delegatorShifts = updateShifts(
            delegator,
            { date: other.owner_date, shift: other.owner_shift },
            other.no_swap === 0
                ? { date: other.swap_date, shift: '' } 
                : null
        );

        let data = { ...other, owner_shifts: ownerShifts, delegator_shifts: delegatorShifts };

        approve(id, data);
    };

    const approve = async (id, data) => {
        console.log(data);
        const res = await api.put(`/swappings/${id}/approve`, data);
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
                                                        <span className="ml-2">
                                                            ขึ้นปฏิบัติแทน
                                                        </span>
                                                        {swapping.no_swap === 0 ? (
                                                            <span className="mx-2">
                                                                และจะขึ้นปฏิบัติแทน เวร {swapping.swap_shift} ในวันที่ {moment(swapping.swap_date).format('DD/MM/YYYY')}
                                                            </span>
                                                        ) : (
                                                            <span className="mx-2">
                                                                โดยไม่ขึ้นปฏิบัติแทน
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <span className="btn bg-maroon btn-xs">
                                                        {swapping.status}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <a href="#" className="btn btn-primary btn-sm" onClick={(e) => handleApprovement(e, swapping)}>
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
