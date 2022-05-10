import React, { useEffect, useState } from 'react';
import { calculateShiftsTotal } from '../../../utils'

const initialTotal = {
    night: 0,
    morn: 0,
    even: 0,
    bd: 0
};

const TotalShiftsRow = ({ shifts, person }) => {
    const [total, setTotal] = useState(initialTotal);

    useEffect(() => {
        if (shifts) {
            let shiftsTotal = calculateShiftsTotal(shifts);

            setTotal(shiftsTotal);
        }
    }, [shifts, person]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {total.night + total.morn + total.even + total.bd}
            {/* <span>ด={total.night}</span>
            <span>ช={total.morn}</span>
            <span>บ={total.even}</span>
            <span>B={total.bd}</span> */}
        </div>
    )
}

export default TotalShiftsRow
