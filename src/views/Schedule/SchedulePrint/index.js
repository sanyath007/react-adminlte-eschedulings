import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CustomErrorComponent } from 'custom-error';
import FileViewer from 'react-file-viewer';
import { Document, Page, pdfjs } from 'react-pdf';
import api from '../../../api';
import pdfjsWorker from "react-pdf/src/pdf.worker.entry";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const SchedulePrint = (props) => {
    const { id } = useParams();
    const [file, setFile] = useState(null);
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
        const res = await api.get('/files/1');

        setFile(res.data);
    };

    useEffect(() => {
        getFile();
    }, []);

    const onError = (e) => {
        console.log(e, 'error in file-viewer');
    }

    return (
        <div className="container-fluid">
            <FileViewer
                fileType="pdf"
                filePath={file}
                errorComponent={CustomErrorComponent}
                onError={onError}
            />
            {/* <Document
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
            </div> */}
        </div>
    );
}

export default SchedulePrint;
