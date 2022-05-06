import React, { useState } from 'react';
import ShiftButton from '../ShiftButton';

const ExistedShiftsOfDay = ({ month, day, shiftsOfDay, onSelectedShift, ...props }) => {
    return (
        <>
            {shiftsOfDay.map((sh, index) => {
                return sh !== ''
                    ? (
                        <ShiftButton
                            key={sh+index}
                            month={month}
                            day={day}
                            shift={sh}
                            onSelectedShift={onSelectedShift}
                        />
                    ) : null;
                }
            )}
        </>
    );
};

export default ExistedShiftsOfDay;
