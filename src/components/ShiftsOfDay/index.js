import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'react-uuid';
import ShiftText from '../ShiftText';
import ShiftButton from '../ShiftButton';

const ShiftsOfDay = ({
  shifts,
  otShift,
  shiftText,
  onSetOT,
  onClick,
}) => {

  return (
    <>
      {shifts.split('|').length > 0 && shifts.split('|').map((el, index) => {
        /** แปลง otShift เป็น array โดยถ้ามีเวร OT มากกว่า 1 จะถูกแยกด้วยเครื่องหมาย | */
        const arrOtShift = otShift.split('|');

        return (
          <>
            {shiftText ? (
              <ShiftText
                key={uuid()}
                text={el}
                otShiftText={arrOtShift.length > 1 ? arrOtShift[index] : arrOtShift[0]}
                onSetOT={onSetOT}
              />
            ) : (
              <ShiftButton
                key={uuid()}
                text={el}
                otShiftText={arrOtShift.length > 1 ? arrOtShift[index] : arrOtShift[0]}
                onClick={onClick}
              />
            )}
          </>
        );
      })}
    </>
  );
}

ShiftsOfDay.propTypes = {
  shifts: PropTypes.string,
  otShift: PropTypes.string,
  shiftText: PropTypes.bool,
  onSetOT: PropTypes.func,
  onClick: PropTypes.func
};

export default ShiftsOfDay
