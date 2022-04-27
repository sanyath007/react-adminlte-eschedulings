import React, { useEffect, useState } from 'react'
import './styles.css';

const ShiftText = ({ text, otShift, onSetOT }) => {
  const [isOT, setIsOT] = useState(false);

  useEffect(() => {
    if (text !== '' && otShift !== '' && text === otShift) {
      setIsOT(true)
    }
  }, [text, otShift]);

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

export default ShiftText