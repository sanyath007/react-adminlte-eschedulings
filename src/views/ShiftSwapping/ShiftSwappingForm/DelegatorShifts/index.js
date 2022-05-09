import React, { useEffect, useState } from 'react';
import moment from 'moment';
import api from '../../../../api';
import DailyColumns from '../../../../components/DailyColumns';
import EmptyShiftsOfDay from '../EmptyShiftsOfDay';
import ExistedShiftsOfDay from '../ExistedShiftsOfDay';

const DelegatorShifts = ({ schedule, shiftsOfDelegator, noSwap, onSelectedShift }) => {
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        getHolidays();
    }, []);

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
                    <td style={{ textAlign: 'center' }} colSpan={ 31 }>วันที่</td>
                </tr>
                <DailyColumns
                    month={schedule ? schedule.month : moment().format('YYYY-MM')}
                    holidays={holidays}
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
