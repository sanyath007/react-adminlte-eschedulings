import React from 'react'
import StatCard from './StatCard';

const Dashboard = () => {
  return (
    <div className="container-fluid">
      {/* Stat card */}
      <div className="row">
        <div className="col-lg-3 col-6">
          <StatCard title="New Orders" value="150" bgColor="bg-info" icon="ion-bag" />
        </div>
        <div className="col-lg-3 col-6">
          <StatCard title="Bounce Rate" value="53" bgColor="bg-success" icon="ion-stats-bars" />
        </div>
        <div className="col-lg-3 col-6">
          <StatCard title="User Registrations" value="44" bgColor="bg-warning" icon="ion-person-add" />
        </div>
        <div className="col-lg-3 col-6">
          <StatCard title="Unique Visitors" value="65" bgColor="bg-danger" icon="ion-pie-graph" />
        </div>
      </div>

      {/* Main row */}
      <div className="row">
        {/* Left col */}
        <section className="col-lg-7 connectedSortable">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-chart-pie mr-1"></i>
                Sales
              </h3>
              <div className="card-tools">
                <ul className="nav nav-pills ml-auto">
                  <li className="nav-item">
                    <a className="nav-link active" href="#revenue-chart" data-toggle="tab">Area</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#sales-chart" data-toggle="tab">Donut</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card-body">
              <div className="tab-content p-0">
                <div className="chart tab-pane active" id="revenue-chart" style={{ position: 'relative', height: '300px' }}>
                  {/* <canvas id="revenue-chart-canvas" height="300" style={{ height: '300px' }}></canvas> */}
                </div>
                <div className="chart tab-pane" id="sales-chart" style={{ position: 'relative', height: '300px' }}>
                  {/* <canvas id="sales-chart-canvas" height="300" style={{ height: '300px' }}></canvas> */}
                </div>  
              </div>
            </div>
          </div>
        </section>
        {/* Left col */}

        {/* Right col (We are only adding the ID to make the widgets sortable) */}
        <section className="col-lg-5 connectedSortable">
          {/* Components here ... */}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
