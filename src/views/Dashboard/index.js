import React from 'react';
import StatCardList from './StatCardList';

const Dashboard = () => {
    return (
        <div className="container-fluid">
            {/* Stat card */}
            <StatCardList />

            {/* Main row */}
            <div className="row">

                {/* Left col */}
                <section className="col-lg-7 connectedSortable">
                    {/* Components here ... */}
                </section>
                {/* Left col */}

                {/* Right col */}
                <section className="col-lg-5 connectedSortable">
                    {/* Components here ... */}
                </section>
                {/* Right col */}

            </div>
            {/* Main row */}
        </div>
    );
};

export default Dashboard;
