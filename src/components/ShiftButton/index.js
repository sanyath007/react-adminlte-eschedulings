import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import './styles.css';

const ShiftButton = ({ text, otShiftText, onClick }) => {
  const [isOT, setIsOT] = useState(false);

  useEffect(() => {
    if (text !== '' && otShiftText !== '' && text === otShiftText) {
      setIsOT(true)
    }
  }, [text, otShiftText]);

  return (
    <a
      href='#'
      onClick={() => onClick(text, !isOT)}
      className={ isOT ? 'ot-active' : '' }
    >
      {text}
    </a>
  );
}

ShiftButton.propTypes = {
  text: PropTypes.string,
  otShiftText: PropTypes.string,
  onClick: PropTypes.func
};

export default ShiftButton