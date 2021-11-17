import React from 'react';

const ChartJS = () => {
  return (
    <div className="container-fluid">
      <div className="row">

        {/* LEFT */}
        <div className="col-md-6">

          {/* AREA CHART */}
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">Area Chart</h3>

              <div className="card-tools">
                <button type="button" className="btn btn-tool" data-card-widget="collapse">
                  <i className="fas fa-minus"></i>
                </button>
                <button type="button" className="btn btn-tool" data-card-widget="remove">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="chart">
                <canvas id="areaChart" style={{ height: '250px', minHeight: '250px' }}></canvas>
              </div>
            </div>
          </div>

          {/* DONUT CHART */}
          <div className="card card-danger">
            <div className="card-header">
              <h3 className="card-title">Donut Chart</h3>

              <div className="card-tools">
                <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus"></i>
                </button>
                <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i></button>
              </div>
            </div>
            <div className="card-body">
              <canvas id="donutChart" style={{ height: '230px', minHeight: '230px' }}></canvas>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-md-6">

          {/* LINE CHART */}
          <div className="card card-info">
            <div className="card-header">
              <h3 className="card-title">Line Chart</h3>

              <div className="card-tools">
                <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus"></i>
                </button>
                <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i></button>
              </div>
            </div>
            <div className="card-body">
              <div className="chart">
                <canvas id="lineChart" style={{ height: '250px', minHeight: '250px'}}></canvas>
              </div>
            </div>
          </div>

          {/* BAR CHART */}
          <div className="card card-success">
            <div className="card-header">
              <h3 className="card-title">Bar Chart</h3>

              <div className="card-tools">
                <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus"></i>
                </button>
                <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i></button>
              </div>
            </div>
            <div className="card-body">
              <div className="chart">
                <canvas id="barChart" style={{ height: '230px', minHeight: '230px' }}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartJS;
