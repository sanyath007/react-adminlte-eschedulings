import React, { useEffect, useState } from 'react'
import moment from 'moment';

const DailyColumns = ({ month, holidays }) => {
    const [cols, setCols] = useState([]);
    const [holiday, setHoliday] = useState([]);

    useEffect(() => {
        console.log('DailyColumns effect !!');
        const daysOfMonth = Array(moment(month).endOf('month').date());
        console.log('end of month is ', moment(month).endOf('month').date());
        console.log('daysOfMonth is ', daysOfMonth);

        /** Filter only holiday that be in month props */
        setHoliday(holidays.filter(holiday => moment(holiday.holiday_date).format('YYYY-MM') == moment(month).format('YYYY-MM')));

        setCols([...daysOfMonth]);
    }, [month, holidays]);

    console.log(`cols is `, cols);

    return (
        <tr>
            {cols && cols.map((obj, i) => {
                console.log(`i = ${i}`);
                /** Check is day in holiday */
                const isHoliday = holiday.some(hd => moment(hd.holiday_date).format('YYYY-MM-DD') == moment(`${month}-${i+1}`).format('YYYY-MM-DD'));

                return (
                    <td
                        key={i}
                        style={{ width: '2%', textAlign: 'center', fontSize: 'small' }}
                        className={ `${isHoliday ? 'bg-secondary' : ''}` }
                    >
                        { i + 1 }
                    </td>
                );
            })}
        </tr>
    );
}

export default DailyColumns;
