import React from 'react'

const PersonShiftsRow = ({ row }) => {
    console.log(row);
    return (
            <tr>
                <td>{row.person_id}</td>
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
