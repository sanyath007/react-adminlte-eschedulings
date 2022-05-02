import React from 'react'
import { useParams } from 'react-router-dom';
import './styles.css';

const SchedulePdf = () => {
    const { id } = useParams();
    const file = `http://localhost/public_html/laravel54-eschedulings-api/public/files/${id}/print`;

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

export default SchedulePdf