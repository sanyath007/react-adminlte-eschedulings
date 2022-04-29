import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import api from '../../../api';
import pdfjsWorker from "react-pdf/src/pdf.worker.entry";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const SchedulePrint = (props) => {
    const { id } = useParams();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page

    function onDocumentLoadSuccess({ numPages }) {
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
        const res = await api.get('http://localhost/public_html/slim3-eschedulings-api/public/uploads/10122021081424616543e0f0970.pdf');

        console.log(res);
    };

    useEffect(() => {
        getFile();
    }, []);

    return (
        <div className="container-fluid">
            <Document
                file="http://localhost/public_html/slim3-eschedulings-api/public/uploads/10122021081424616543e0f0970.pdf"
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
