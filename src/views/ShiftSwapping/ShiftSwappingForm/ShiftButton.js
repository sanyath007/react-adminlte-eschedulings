import React from 'react';
import moment from 'moment';

const ShiftButton = ({ month, day, shift, onSelectedShift, ...props }) => {
    const getEventBgColor = function (shift) {
        let btnColor = '';
        if (['ด','ด*','ด**','ด^'].includes(shift)) {
            btnColor = 'btn-info';
        } else if (['ช','ช*','ช**','ช^'].includes(shift)) {
            btnColor = 'btn-success';
        } else if (['บ','บ*','บ**','บ^'].includes(shift)) {
            btnColor = 'btn-danger';
        } else if (['B','B*','B**','B^'].includes(shift)) {
            btnColor = 'btn-warning';
        } else {
            btnColor = 'btn-default';
        }

        return btnColor;
    };

    return (
        <a
            href="#"
            className={ `btn ${getEventBgColor(shift)} btn-sm mb-1` }
            onClick={() => onSelectedShift(moment(`${month}-${day}`).toDate(), shift)}
        >
            {shift}
        </a>
    )
}

export default ShiftButton;
