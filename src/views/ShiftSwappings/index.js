import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
        const res = await api.get('/swapings');
        console.log(res);

        setSwappings(res.data.swappings)
    };

    const onPaginateLinkClick = () => {

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

                            </table>

                        </div>{/* <!-- /.card-body --> */}
                        <div className="card-footer clearfix">
                            <div className="row">
                                {/* <div className="col-3 m-0 float-left">
                                    <a href="#" className="btn btn-success btn-sm">Excel</a>
                                </div> */}
                                
                                <div className="col-6 m-0" style={{ textAlign: 'center' }}>
                                    <span>จำนวนทั้งหมด { pager && pager?.total } ราย</span>
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
    )
}

export default ShiftSwappingList;
