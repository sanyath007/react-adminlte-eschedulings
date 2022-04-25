import React from 'react';
import ShiftText from '../ShiftText';

const ShiftsOfDay = ({ shifts, onSetOT }) => {
  return (
    <>
      {shifts.split('|').length > 0 && shifts.split('|').map((el, index) => (
        <ShiftText key={index+el} text={el} onSetOT={onSetOT} />
      ))}
    </>
  );
}

export default ShiftsOfDay
