import React, { useEffect, useState } from 'react';
import { calculateShiftsTotal } from '../../../utils';

const initialTotal = {
    night: 0,
    morn: 0,
    even: 0,
    bd: 0
};

const TotalShifts = ({ shifts, shiftOfDay }) => {
    const [total, setTotal] = useState(initialTotal);

    useEffect(() => {
        const shiftsTotal = calculateShiftsTotal(shifts);

        setTotal(shiftsTotal);
    }, [shifts, shiftOfDay]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>ด={total.night}</span>
            <span>ช={total.morn}</span>
            <span>บ={total.even}</span>
            <span>B={total.bd}</span>
        </div>
    )
}

export default TotalShifts
