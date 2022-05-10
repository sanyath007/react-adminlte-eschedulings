import React from 'react';

const StatCard = ({ title, value, bgColor, icon, ...props }) => {
    return (
        <div className={`small-box ${bgColor}`}>
            <div className="inner">
                <h3>{value}</h3>

                <p>{title}</p>
            </div>
            <div className="icon">
                <i className={`ion ${icon}`}></i>
            </div>
            <a href="#" className="small-box-footer">
                More info <i className="fas fa-arrow-circle-right"></i>
            </a>
        </div>
    )
}

export default StatCard;
