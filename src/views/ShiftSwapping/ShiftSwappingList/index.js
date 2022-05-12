import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import api from '../../../api';
import { calculateShiftsTotal } from '../../../utils';
import MonthlyText from '../../../components/MonthlyText';

const ShiftSwappingList = () => {
    /** Global states */
    const { user } = useSelector(state => state.users);

    /** Local states */
    const [swappings, setSwappings] = useState([]);
    const [pager, setPager] = useState(null);

    useEffect(() => {
        fetchSwaps();
    }, []);
    
    const fetchSwaps = async (url='/swappings?page=') => {
        const depart = user?.person_id === '1300200009261' ? '' : user?.member_of?.depart_id;

        const res = await api.get(`${url}&depart=${depart}`);

        const { data, ...pager } = res.data.swappings

        setSwappings(data);
        setPager(pager);
    };

    const onPaginateLinkClick = (e, url) => {
        fetchSwaps(url);
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
        const res = await api.put(`/swappings/${id}/approve`, data);

        if (res.data.status === 1) {
            toast.success('อนุมัติเวรเรียบร้อย !!!', { autoClose: 1000, hideProgressBar: true });

            fetchSwaps();
        } else {
            toast.error('พบข้อผิดพลาด ไม่สามารถอนุมัติเวรได้ !!!', { autoClose: 1000, hideProgressBar: true });
        }
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
                                รายการเปลี่ยนเวร
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
                                        const { schedule, owner, delegator } = swapping;

                                        return (
                                            <tr key={index+swapping.id}>
                                                <td style={{ textAlign: 'center' }}>{index+1}</td>
                                                <td>
                                                    {`${owner?.person?.person_firstname} ${owner?.person?.person_lastname}`}
                                                    <p className="m-0">
                                                        {schedule.depart.depart_name}
                                                    </p>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>
                                                            วันที่ {moment(swapping.owner_date).format('DD/MM/YYYY')} / เวร {swapping.owner_shift}
                                                        </span>
                                                        <span className="ml-2">
                                                            ประจำเดือน <MonthlyText monthText={schedule.month} />
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
                                                    {`${delegator?.person?.person_firstname} ${delegator?.person?.person_lastname}`}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <span className={`btn btn-xs ${swapping.status == 'REQUESTED' ? 'bg-maroon' : 'bg-green'}`}>
                                                        {swapping.status}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div className="btn-group btn-group-sm" role="group" aria-label="...">
                                                        <Link to={`/swappings/${swapping.id}/pdf`} className="btn btn-success">
                                                            <i className="fas fa-print"></i>
                                                        </Link>

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
    )
}

export default ShiftSwappingList;
