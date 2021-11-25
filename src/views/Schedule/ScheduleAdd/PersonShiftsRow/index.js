import React from 'react'

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
                <td></td>
                <td></td>
            </tr>
    );
}

export default PersonShiftsRow;
