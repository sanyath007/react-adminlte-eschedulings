import React, { useEffect, useState } from 'react'
import moment from 'moment';

const DailyColumns = ({ month }) => {
    const [cols, setCols] = useState([]);

    useEffect(() => {
        const daysOfMonth = Array(moment(month).endOf('month').date());

        setCols([...daysOfMonth]);
    }, [month]);

    return (
        <tr>
            {cols && cols.map((obj, i) => {
                const isHoliday = moment(`${month}-${i+1}`).weekday() === 0 || moment(`${month}-${i+1}`).weekday() === 6;

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
