import React, { useEffect, useState } from 'react'

const ShiftsOfDay = ({ shifts }) => {
    const [text, setText] = useState('');

    useEffect(() => {
        let tmp = '';
        shifts.split('|').forEach(el => {
            if (el !== '') {
                tmp += el;
            }
        });

        setText(tmp);
    }, []);

    return <span>{text}</span>;
}

export default ShiftsOfDay
