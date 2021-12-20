import React, { useEffect, useState } from 'react';
import moment from 'moment';
import api from '../../../api';
import DailyColumns from '../../../components/DailyColumns';

const DelegateShifts = ({ schedule, shiftsOfPerson, onSelectedShift }) => {
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        getHolidays();
    }, []);

    const getHolidays = async function () {
        try {
            const res = await api.get(`/api/holidays`);

            setHolidays(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getEventBgColor = function (shift) {
        let btnColor = '';
        if (['ด','ด*','ด**','ด^'].includes(shift)) {
            btnColor = 'btn-info';
        } else if (['ช','ช*','ช**','ช^'].includes(shift)) {
            btnColor = 'btn-success';
        } else if (['บ','บ*','บ**','บ^'].includes(shift)) {
            btnColor = 'btn-danger';
        } else if (['B','B*','B**','B^'].includes(shift)) {
            btnColor = 'btn-warning';
        } else {
            btnColor = 'btn-default';
        }

        return btnColor;
    };

    const renderShiftsOfDay = function (day, shift) {
        return shift.split('|').map((sh, index) => {
            return sh !== ''
                    ? (
                        <a
                            href="#"
                            key={sh+index}
                            className={ `btn ${getEventBgColor(sh)} btn-sm mb-1` }
                            onClick={() => handleSelectedShift(moment(`${schedule.month}-${day}`).toDate(), sh)}
                        >
                            {sh}
                        </a>
                    ) : null;
        });
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
                    {shiftsOfPerson && shiftsOfPerson.shifts.split(',').map((shift, index) => {
                        return (
                            <td key={index} style={{ textAlign: 'center', fontSize: '14px', padding: '0' }}>
                                {renderShiftsOfDay(index+1, shift)}
                            </td>
                        );
                    })}
                </tr>
            </tbody>
        </table>
    )
}

export default DelegateShifts
