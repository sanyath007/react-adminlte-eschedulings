import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ShiftSwappingList = () => {
    const { user } = useSelector(state => state.users);
    console.log(user);

    return (
        <div>ShiftSwappingList</div>
    )
}

export default ShiftSwappingList;
