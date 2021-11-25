import React, { useState } from 'react';

const ShiftInput = (props) => {
    const [textSelected, setTextSelected] = useState('-');
    const [btnGroupClass, setBtnGroupClass] = useState('btn-default');

    const onSelected = function (shift) {
        setTextSelected(shift);

        if (shift === '-') {
            setBtnGroupClass('btn-default');
        } else if (shift === 'ด') {
            setBtnGroupClass('btn-info');
        } else if (shift === 'ช') {
            setBtnGroupClass('btn-success');
        } else if (shift === 'บ') {
            setBtnGroupClass('btn-danger');
        } else if (shift === 'BD') {
            setBtnGroupClass('btn-warning');
        }
    }

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
                style={{ minWidth: '4rem' }}
            >
                <a href="#" className="dropdown-item" onClick={() => onSelected('-')}>
                    -
                </a>
                <a href="#" className="dropdown-item" onClick={() => onSelected('ด')}>
                    ด
                </a>
                <a href="#" className="dropdown-item" onClick={() => onSelected('ช')}>
                    ช
                </a>
                <a href="#" className="dropdown-item" onClick={() => onSelected('บ')}>
                    บ
                </a>
                <a href="#" className="dropdown-item" onClick={() => onSelected('BD')}>
                    BD
                </a>
            </div>
        </div>
    );
}

export default ShiftInput;