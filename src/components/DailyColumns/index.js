import React, { useEffect, useState } from 'react'
import moment from 'moment';

const DailyColumns = ({ month, ...props }) => {
    const [cols, setCols] = useState([]);
    const [holiday, setHoliday] = useState([]);

    useEffect(() => {
        if (props.holidays) {
            const daysOfMonth = Array(moment(month).endOf('month').date());
            setCols([...daysOfMonth]);

            /** Filter only holiday that be in month props */
            setHoliday(props.holidays.filter(hd => {
                return moment(hd.holiday_date).format('YYYY-MM') == moment(month).format('YYYY-MM');
            }));
        }
    }, [month, props.holidays]);

    return (
        <tr>
            {cols && cols.map((obj, i) => {
                /** Check is day in holiday */
                const isHoliday = holiday.some(hd => {
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
