import React, { useEffect, useState } from 'react'
import moment from 'moment';

const DailyColumns = ({ month, holidays, cols, ...props }) => {
    const [holidayOfMonth, setHolidayOfMonth] = useState([]);

    useEffect(() => {
        if (holidays) {
            /** Filter only holiday that be in month props */
            setHolidayOfMonth(holidays.filter(hd => {
                return moment(hd.holiday_date).format('YYYY-MM') == moment(month).format('YYYY-MM');
            }));
        }
    }, [month, holidays]);

    return (
        <tr>
            {cols && [...Array(cols)].map((el, i) => {
                /** Check is day in holiday */
                const isHoliday = holidayOfMonth.some(hd => {
                    return moment(hd.holiday_date).format('YYYY-MM-DD') == moment(`${month}-${i+1}`).format('YYYY-MM-DD');
                });

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
