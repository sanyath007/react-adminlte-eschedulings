import React, { useEffect, useState, useRef } from 'react'

const initialTotal = {
    night: 0,
    morn: 0,
    even: 0,
    bd: 0
};

const TotalShiftsRow = ({ shifts, person }) => {
    const [total, setTotal] = useState(initialTotal);

    const calculateTotal = () => {
        let tmpTotal = { ...initialTotal };

        shifts.forEach((shift, day) => {
            let arrShift = shift.split('|');

            arrShift.forEach(el => {
                if (el === 'ด') {
                    tmpTotal.night += 1;
                } else if (el === 'ช') {
                    tmpTotal.morn += 1;
                } else if (el === 'บ') {
                    tmpTotal.even += 1;
                } else if (el === 'B') {
                    tmpTotal.bd += 1;
                }
            });
        });

        setTotal(tmpTotal);
    };

    useEffect(() => {
        calculateTotal();
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
