import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './styles.css';

const SchedulePdf = () => {
    const { id, type } = useParams();
    const [file, setFile] = useState('');

    useEffect(() => {
        if (type == 1) {
            setFile(`${process.env.REACT_APP_FILE_URL}/${id}/print`);
        } else if (type == 2) {
            setFile(`${process.env.REACT_APP_FILE_URL}/${id}/print2`);
        } else if (type == 3) {
            setFile(`${process.env.REACT_APP_FILE_URL}/${id}/print3`);
        } else if (type == 4) {
            setFile(`${process.env.REACT_APP_FILE_URL}/${id}/print4`);
        }
    }, [type]);

    return (
        <>
            {file !== '' && <object data={file} type="application/pdf">
                <iframe
                    id="print-file"
                    title="pdf document"
                    src={`https://docs.google.com/viewer?url=${file}&embedded=true`}
                />
            </object>}
        </>
    )
}

export default SchedulePdf