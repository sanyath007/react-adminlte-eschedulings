import React from 'react'
import { useParams } from 'react-router-dom';
import './styles.css';

const ShiftSwappingPdf = () => {
    const { id } = useParams();
    const file = `${process.env.REACT_APP_FILE_URL}/${id}/swap`;

    return (
        <>
            <object data={file} type="application/pdf">
                <iframe
                    id="print-file"
                    title="pdf document"
                    src={`https://docs.google.com/viewer?url=${file}&embedded=true`}
                />
            </object>
        </>
    )
}

export default ShiftSwappingPdf