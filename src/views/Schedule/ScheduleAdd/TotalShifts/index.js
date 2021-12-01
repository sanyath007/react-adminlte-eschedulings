import React, { useEffect, useState, useRef } from 'react'

const initialTotal = {
    night: 0,
    morn: 0,
    even: 0,
    bd: 0
};

const TotalShifts = ({ shifts, shiftOfDay }) => {
    const [total, setTotal] = useState(initialTotal);

    const calculateTotal = () => {
        let tmpTotal = { ...initialTotal };

        shifts.forEach((shift, day) => {
            for (let i = 1; i <= 3; i++) {
                if (shift[`${day}_${i}`] === 'ด' || shift[`${day}_${i}`] === 'ด' || shift[`${day}_${i}`] === 'ด') {
                    tmpTotal.night += 1;
                } else if (shift[`${day}_${i}`] === 'ช' || shift[`${day}_${i}`] === 'ช' || shift[`${day}_${i}`] === 'ช') {
                    tmpTotal.morn += 1;
                } else if (shift[`${day}_${i}`] === 'บ' || shift[`${day}_${i}`] === 'บ' || shift[`${day}_${i}`] === 'บ') {
                    tmpTotal.even += 1;
                } else if (shift[`${day}_${i}`] === 'B' || shift[`${day}_${i}`] === 'B' || shift[`${day}_${i}`] === 'B') {
                    tmpTotal.bd += 1;
                }
            }
        });

        setTotal(tmpTotal);
    };

    useEffect(() => {
        calculateTotal();
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
