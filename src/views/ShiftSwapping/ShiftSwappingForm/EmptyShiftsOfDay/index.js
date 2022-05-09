import React, { useState } from 'react';
import ShiftButton from '../ShiftButton';

const ExistedShiftsOfDay = ({ month, day, shiftsOfDay, onSelectedShift, ...props }) => {
    /** Intersection shiftsOfDay with emptyShifts */
    let emptyShifts = ['ช','บ','ด'].filter(sh => !shiftsOfDay.includes(sh));

    return (
        <>
            {emptyShifts.map((sh, index) => (
                <ShiftButton
                    key={sh+index}
                    month={month}
                    day={day}
                    shift={sh}
                    onSelectedShift={onSelectedShift}
                />
            ))}
        </>
    );
};

export default ExistedShiftsOfDay;
