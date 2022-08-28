import React from 'react';
import CSVReader from 'react-csv-reader';
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import Grid from "./Grid";

function CsvLoader() {

    const papaparseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header =>
            header
                .toLowerCase()
                .replace(/\W/g, '_')
    }

    let result = [];
    let gridRoot = createRoot(document.getElementById('grid'));

    function handleForce(data, fileInfo) {
        result = [];
        data.map(row => {
            let values = Object.values(row);
            if (values.length > 0 && values[0] > 0 && values[0] != null) {
                let dateArray = values[1].split(".");
                let timeStartArray = values[2].split(":");
                let timeEndArray = values[3].split(":");
                let coords = values[5].split(" ");
                result.push({
                    "DateStart": new Date(dateArray[2], dateArray[1] - 1, dateArray[0], timeStartArray[0], timeStartArray[1]),
                    "DateEnd": new Date(dateArray[2], dateArray[1] - 1, dateArray[0], timeEndArray[0], timeEndArray[1]),
                    "Region": values[4],
                    "Longitude": parseFloat(coords[1]),
                    "Latitude": parseFloat(coords[0]),
                    "Frequency": typeof values[6] === "string" ? parseFloat(values[6].replace(",", ".")) : parseFloat(values[6])
                });
            }
        });
        gridRoot.render(
            <BrowserRouter>
                <Grid items={result} />
            </BrowserRouter>
        );
    }

    return (
        <CSVReader
            cssClass="custom-file"
            cssInputClass="custom-file-input"
            cssLabelClass="custom-file-label"
            inputId="react-csv-reader-input"
            label="Load CSV"
            onFileLoaded={handleForce}
            parserOptions={papaparseOptions}
            inputStyle={{ color: 'black' }}
        />
    )

}

export default CsvLoader;