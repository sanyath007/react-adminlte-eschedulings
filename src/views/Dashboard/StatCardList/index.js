import React from 'react';
import StatCard from '../StatCard';

const StatCardList = () => {
    return (
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
    )
}

export default StatCardList;
