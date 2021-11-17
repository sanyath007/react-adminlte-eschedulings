import React from 'react';

const Flot = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card card-primary card-outline">
            <div className="card-header">
              <h3 className="card-title">
                <i className="far fa-chart-bar"></i>
                Interactive Area Chart
              </h3>

              <div className="card-tools">
                Real time
                <div className="btn-group" id="realtime" data-toggle="btn-toggle">
                  <button type="button" className="btn btn-default btn-sm active" data-toggle="on">On</button>
                  <button type="button" className="btn btn-default btn-sm" data-toggle="off">Off</button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div id="interactive" style={{ height: '300px' }}></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Flot;
