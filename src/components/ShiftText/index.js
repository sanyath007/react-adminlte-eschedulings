import React, { useEffect, useState } from 'react'
import './styles.css';

const ShiftText = ({ text, onSetOT }) => {
  const [isOT, setIsOT] = useState(false);

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