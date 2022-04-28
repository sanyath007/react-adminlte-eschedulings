import React from 'react';
import ShiftText from '../ShiftText';

const ShiftsOfDay = ({ shifts, otShift, onSetOT }) => {
  return (
    <>
      {shifts.split('|').length > 0 && shifts.split('|').map((el, index) => {
        /** แปลง otShift เป็น array โดยถ้ามีเวร OT มากกว่า 1 จะถูกแยกด้วยเครื่องหมาย | */
        const arrOtShift = otShift.split('|');

        return (
          <ShiftText
            key={index+el}
            text={el}
            otShift={arrOtShift.length > 1 ? arrOtShift[index] : arrOtShift[0]}
            onSetOT={onSetOT}
          />
        );
      })}
    </>
  );
}

export default ShiftsOfDay
