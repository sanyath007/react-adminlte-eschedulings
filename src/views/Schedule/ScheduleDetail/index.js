import React from 'react'

const ScheduleDetail = () => {
    const departs = [];
    const divisions = [];
    const scheduling_shifts = [];
    const shifts = [];
    const pager = null;
    const dataTableOptions = {
        totalCol: 31
    };

    const onDepartChange = function (e) {
        console.log(e);
    };

    const onDivisionChange = function (e) {
        console.log(e);
    };

    const getAll = function (e) {
        console.log(e);
    };

    const onPaginateLinkClick = function (e, pageUrl) {
        console.log(e, pageUrl);
    };

    return (
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

                                <button onClick={ (e) => getAll(e) } className="btn btn-primary">ตกลง</button>
                            </form>

                        </div>{/* <!-- /.card-body --> */}
                    </div>{/* <!-- /.card --> */}

                    <div className="card">
                        <div className="card-body">
                            <div className="row my-2">
                                <div className="col-md-12">
                                    <a href="schedulings/add" className="btn btn-primary float-right">เพิ่มตารางเวร</a>
                                </div>
                            </div>

                            <table className="table table-bordered table-striped" style={{ fontSize: '14px' }}>
                                <thead>
                                    <tr>
                                        <td style={{ textAlign: 'center' }} rowSpan="2">ชื่อ-สกุล</td>
                                        <td style={{ textAlign: 'center' }} colSpan={ dataTableOptions.totalCol }>วันที่</td>
                                        <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">Actions</td>
                                    </tr>
                                    <tr>
                                        {[...Array(dataTableOptions.totalCol)].map((m, i) => {
                                            return (
                                                <td key={i} style={{ width: '2.5%', textAlign: 'center', fontSize: 'small' }}>
                                                    { i+1 }
                                                </td>
                                            )
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {scheduling_shifts && scheduling_shifts.map(row => {
                                        return (
                                            <tr>
                                                <td>
                                                    { row.person_name }
                                                    <p style={{ color: 'grey', margin: '0px' }}>
                                                        ตำแหน่ง ...
                                                    </p>
                                                </td>
                                                {row.shifts.map(shift => {
                                                    return (
                                                        <td style={{ textAlign: 'center', fontSize: 'small', padding: '0px' }}>
                                                            { shift }
                                                        </td>
                                                    );
                                                })}
                                                <td style={{ textAlign: 'center' }}></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="row mt-2">
                                <div className="col-md-6">
                                    ผู้ควบคุม
                                </div>
                                <div className="col-md-6">
                                    หัวหน้ากลุ่มงาน
                                </div>
                                <div className="col-md-6">
                                    หัวหน้ากลุ่มภารกิจ
                                </div>
                                <div className="col-md-6">
                                    ผู้อำนวยการ
                                </div>
                            </div>

                        </div>{/* <!-- /.card-body --> */}
                        <div className="card-footer clearfix">
                            <div className="row">
                                <div className="col-3 m-0 float-left">
                                    <a href="#" className="btn btn-success btn-sm">Excel</a>
                                </div>
                                
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
    );
}

export default ScheduleDetail;
