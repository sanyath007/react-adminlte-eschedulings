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
                if (['ด','ด*','ด**','ด^'].includes(shift[`${day}_${i}`])) {
                    tmpTotal.night += 1;
                } else if (['ช','ช*','ช**','ช^'].includes(shift[`${day}_${i}`])) {
                    tmpTotal.morn += 1;
                } else if (['บ','บ*','บ**','บ^'].includes(shift[`${day}_${i}`])) {
                    tmpTotal.even += 1;
                } else if (['B','B*','B**','B^'].includes(shift[`${day}_${i}`])) {
                    tmpTotal.bd += 0.5;
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
