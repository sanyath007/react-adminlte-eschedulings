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
        let tmpTotal = {
            night: 0,
            morn: 0,
            even: 0,
            bd: 0
        };

        shifts.forEach((shift, day) => {
            for (let i = 1; i <= 3; i++) {
                if (shift[`${day}_${i}`] === 'ด' || shift[`${day}_${i}`] === 'ด' || shift[`${day}_${i}`] === 'ด') {
                    tmpTotal.night += 1;
                } else if (shift[`${day}_${i}`] === 'ช' || shift[`${day}_${i}`] === 'ช' || shift[`${day}_${i}`] === 'ช') {
                    tmpTotal.morn += 1;
                } else if (shift[`${day}_${i}`] === 'บ' || shift[`${day}_${i}`] === 'บ' || shift[`${day}_${i}`] === 'บ') {
                    tmpTotal.even += 1;
                } else if (shift[`${day}_${i}`] === 'BD' || shift[`${day}_${i}`] === 'BD' || shift[`${day}_${i}`] === 'BD') {
                    tmpTotal.bd += 1;
                }
            }
        });

        setTotal(tmpTotal);
    };

    useEffect(() => {
        console.log('555');
        calculateTotal();
    }, [shifts, shiftOfDay]);

    console.log(shifts);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>ด={total.night}</span>
            <span>ช={total.morn}</span>
            <span>บ={total.even}</span>
            <span>BD={total.bd}</span>
        </div>
    )
}

export default TotalShifts
