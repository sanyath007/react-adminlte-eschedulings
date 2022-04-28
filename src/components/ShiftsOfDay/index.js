import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import uuid from 'react-uuid';
import ShiftText from '../ShiftText';
import ShiftButton from '../ShiftButton';

const ShiftsOfDay = ({
  shifts,
  otShift,
  asShiftText,
  onSetOT,
  onClick,
  ...props
}) => {
  return (
    <>
      {shifts.split('|').length > 0 && shifts.split('|').map((el, index) => {
        /** แปลง otShift เป็น array โดยถ้ามีเวร OT มากกว่า 1 จะถูกแยกด้วยเครื่องหมาย | */
        const arrOtShift = otShift.split('|');

        return (
          <Fragment key={el+index}>
            {asShiftText ? (
              <ShiftText
                text={el}
                otShiftText={arrOtShift.length > 1 ? arrOtShift[index] : arrOtShift[0]}
                onSetOT={onSetOT}
              />
            ) : (
              <ShiftButton
                text={el}
                otShiftText={arrOtShift.length > 1 ? arrOtShift[index] : arrOtShift[0]}
                onClick={(shiftText) => onClick(shiftText)}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
}

ShiftsOfDay.propTypes = {
  shifts: PropTypes.string,
  otShift: PropTypes.string,
  asShiftText: PropTypes.bool,
  onSetOT: PropTypes.func,
};

export default ShiftsOfDay
