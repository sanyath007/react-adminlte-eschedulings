import React, { useEffect, useState } from 'react';
import moment from 'moment';
import api from '../../../../api';
import DailyColumns from '../../../../components/DailyColumns';
import EmptyShiftsOfDay from '../EmptyShiftsOfDay';
import ExistedShiftsOfDay from '../ExistedShiftsOfDay';
import { lastDayOfMonth } from '../../../../utils';

const DelegatorShifts = ({ schedule, shiftsOfDelegator, noSwap, onSelectedShift }) => {
    const [holidays, setHolidays] = useState([]);
    const [daysOfMonth, setDaysOfMonth] = useState(31);

    useEffect(() => {
        getHolidays();
    }, []);

    useEffect(() => {
        if (schedule) {
            setDaysOfMonth(lastDayOfMonth(schedule.month));
        }
    }, [schedule]);

    const getHolidays = async function () {
        try {
            const res = await api.get(`/holidays`);

            setHolidays(res.data.holidays);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSelectedShift = function (date, shift) {
        onSelectedShift(date, shift)
    };

    return (
        <table className="table table-bordered table-striped mb-1">
            <thead>
                <tr>
                    <td style={{ textAlign: 'center' }} colSpan={ daysOfMonth }>วันที่</td>
                </tr>
                <DailyColumns
                    month={schedule ? schedule.month : moment().format('YYYY-MM')}
                    holidays={holidays}
                    cols={daysOfMonth}
                />
            </thead>
            <tbody>
                <tr>
                    {shiftsOfDelegator && shiftsOfDelegator.shifts.split(',').map((shift, index) => {
                        return (
                            <td key={index} style={{ textAlign: 'center', fontSize: '14px', padding: '0' }}>
                                {!noSwap ? (
                                    <ExistedShiftsOfDay
                                        month={schedule.month}
                                        day={index+1}
                                        shiftsOfDay={shift.split('|')}
                                        onSelectedShift={handleSelectedShift}
                                    />
                                ) : (
                                    <EmptyShiftsOfDay
                                        month={schedule.month}
                                        day={index+1}
                                        shiftsOfDay={shift.split('|')}
                                        onSelectedShift={handleSelectedShift}
                                    />
                                )
                                }
                            </td>
                        );
                    })}
                </tr>
            </tbody>
        </table>
    )
}

export default DelegatorShifts
