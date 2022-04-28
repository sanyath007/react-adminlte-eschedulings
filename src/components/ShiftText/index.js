import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import './styles.css';

const ShiftText = ({ text, otShiftText, onSetOT }) => {
  const [isOT, setIsOT] = useState(false);

  useEffect(() => {
    if (text !== '' && otShiftText !== '' && text === otShiftText) {
      setIsOT(true)
    }
  }, [text, otShiftText]);

  return (
    <a
      href='#'
      onClick={() => {
        setIsOT(!isOT);
        onSetOT(text, !isOT)
      }}
      className={ isOT ? 'ot-active' : '' }
    >
      {text}
    </a>
  );
}

ShiftText.propTypes = {
  text: PropTypes.string,
  otShiftText: PropTypes.string,
  onSetOT: PropTypes.func
};

export default ShiftText;
