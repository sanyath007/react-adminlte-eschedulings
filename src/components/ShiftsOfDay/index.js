import React from 'react';
import ShiftText from '../ShiftText';

const ShiftsOfDay = ({ shifts }) => {
  return (
    <>
      {shifts.split('|').length > 0 && shifts.split('|').map(el => <ShiftText text={el} />)}
    </>
  );
}

export default ShiftsOfDay
