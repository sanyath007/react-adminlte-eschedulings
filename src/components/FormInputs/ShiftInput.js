import React, { useState, useEffect } from 'react';

const ShiftInput = (props) => {
    const [textSelected, setTextSelected] = useState('-');
    const [btnGroupClass, setBtnGroupClass] = useState('btn-default');

    const onSelected = function (shift) {
        const tmpShift = props.shifts.find(sh => sh.id===shift);

        setTextSelected(tmpShift.name);
        setBtnGroupClass(tmpShift.color);

        /** Pass data to parent */
        props.onSelected(tmpShift.name); 
    }

    const setDefault = function () {
        setTextSelected('-');
        setBtnGroupClass('btn-default');
    };

    useEffect(() => {
        if (props.defaultVal) {
            setDefault();
        }
    }, [props.defaultVal]);

    return (
        <div className="btn-group mt-2" role="group">
            <button
                type="button"
                className={`btn ${btnGroupClass} btn-xs dropdown-toggle`}
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
            >
                {textSelected}
            </button>
            <div
                className="dropdown-menu dropdown-menu-right" 
                aria-labelledby={ `${props.id}_btnGroupDrop` }
                style={{ minWidth: '4rem', fontSize: '14px' }}
            >
                {props.shifts && props.shifts.map(shift => {
                    return (
                        <a
                            href="#"
                            key={shift.id}
                            className="dropdown-item text-center"
                            onClick={() => onSelected(shift.id)}
                            style={{ padding: '2px' }}
                        >
                            {shift.name}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

export default ShiftInput;
