import React from 'react';
import ShiftText from '../ShiftText';

const ShiftsOfDay = ({ shifts, otShift, onSetOT }) => {
  return (
    <>
      {shifts.split('|').length > 0 && shifts.split('|').map((el, index) => (
        <ShiftText
          key={index+el}
          text={el}
          otShift={otShift}
          onSetOT={onSetOT}
        />
      ))}
    </>
  );
}

export default ShiftsOfDay
