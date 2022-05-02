import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
import { saveAs } from 'file-saver';
import pdfjsWorker from "react-pdf/src/pdf.worker.entry";
import './styles.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const SchedulePrint = (props) => {
    const { id } = useParams();
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page

    function onDocumentLoadSuccess({ numPages, ...oth }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    const getFile = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('access_token'));

            axios({
                url: `http://localhost/public_html/laravel54-eschedulings-api/public/files/${id}/print`, 
                method: 'GET',
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                setFile(url);

                // saveAs(url, 'test.pdf');
            })
            .catch(err => {
                console.log(err);
            })
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getFile();
    }, []);

    return (
        <div className="viewer">
            <Document
                file={file}
                options={{ workerSrc: "/pdf.worker.js" }}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} />
            </Document>

            <div>
                <p>
                    Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
                </p>
                <button type="button" disabled={pageNumber <= 1} onClick={previousPage}>
                    Previous
                </button>
                <button
                    type="button"
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default SchedulePrint;
