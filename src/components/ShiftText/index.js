import React, { useEffect, useState } from 'react'
import './styles.css';

const ShiftText = ({ text }) => {
  const [isOT, setIsOT] = useState(false);

  return (
    <a href='#' onClick={() => setIsOT(true)} className={ isOT ? 'ot-active' : '' } >
      {text}
    </a>
  );
}

export default ShiftText