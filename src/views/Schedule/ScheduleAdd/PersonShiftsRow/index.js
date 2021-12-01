import React from 'react'
import TotalShiftsRow from '../TotalShiftsRow';

const PersonShiftsRow = ({ row }) => {
    return (
            <tr>
                <td>{`${row.person.prefix?.prefix_name}${row.person.person_firstname} ${row.person.person_lastname}`}</td>
                {row.shifts.map((shift, i) => {
                    return (
                        <td
                            key={i}
                            style={
                                { width: '2%', textAlign: 'center', fontSize: 'small' }
                            }
                        >
                            { shift }
                        </td>
                    );
                })}
                <td>
                    <TotalShiftsRow shifts={row.shifts} person={row.person.person_id} />
                </td>
                <td></td>
            </tr>
    );
}

export default PersonShiftsRow;
