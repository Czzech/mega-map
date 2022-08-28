import React, { useEffect, useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import DTPicker from "./DTPicker";
import Map from "./Map";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

function Grid(props) {

    const [gridApi, setGridApi] = useState([]);
    const [gridColumnApi, setGridColumnApi] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [showFreq, setShowFreq] = useState(false);

    const handleFreqCheckBox = () => {
        setShowFreq(!showFreq);
        RenderMap(gridApi);
    };

    let defaultZoom = 12;
    let defaultCoords = { lat: 60.192059, lng: 24.945831 };

    const RenderMap = (_gridApi) => {
        if (rowData.length > 0) {
            defaultCoords = {
                lat: rowData[0].Latitude,
                lng: rowData[0].Longitude
            };

            dataToMap = [];
            _gridApi.forEachNodeAfterFilter(node => {
                dataToMap.push(node.data);
                defaultCoords.lat = node.data.Latitude;
                defaultCoords.lng = node.data.Longitude;
            });

            modalRoot.render(
                <BrowserRouter>
                    <Map
                        locations={rowData}
                        center={defaultCoords}
                        zoom={defaultZoom}
                        showFreq={!showFreq} />
                </BrowserRouter>
            );
        }
    }

    useEffect(() => {
        setRowData(props.items);
    }, []);

    let dataToMap = props.items;

    let modalRoot = createRoot(document.getElementById('map'));

    const resetAppliedFilters = () => {
        gridApi.setFilterModel(null);
    };

    const DateComparator = function (filterLocalDate, cellValue) {
        let filterBy = filterLocalDate.getTime();
        let filterMe = new Date(cellValue).getTime();
        if (filterBy === filterMe) {
            return 0;
        }

        if (filterMe < filterBy) {
            return -1;
        }

        if (filterMe > filterBy) {
            return 1;
        }
    }

    const onExport = () => {
        gridApi.exportDataAsCsv({
            columnSeparator: ";",
            fileName: "export_" + Date.now(),
            processCellCallback: function(params){
                if(["DateStart", "DateEnd"].indexOf(params.column.colId) !== -1){
                    const date = params.value.toLocaleDateString('us');
                    const hours = params.value.toLocaleTimeString('us');
                    return date + " " + hours;
                }else if(typeof params.value === "number"){
                    return params.value.toString().replace(".",",");
                }else{
                    return params.value;
                }
            }
        });
    };

    const DateRenderer = function (data) {
        if (data.value != null) {
            let date = (new Date(data.value));
            return date.toLocaleDateString() + " " + date.toLocaleTimeString();
        } else {
            return "Error!";
        }
    }

    const cols = [
        {
            field: "DateStart",
            minWidth: 150,
            cellStyle: { textAlign: 'center' },
            cellRenderer: DateRenderer,
            filter: "agDateColumnFilter",
            filterParams: {
                defaultOption: "greaterThan",
                comparator: DateComparator
            }
        },
        {
            field: "DateEnd",
            minWidth: 150,
            cellStyle: { textAlign: 'center' },
            cellRenderer: DateRenderer,
            filter: "agDateColumnFilter",
            filterParams: {
                defaultOption: "lessThan",
                comparator: DateComparator
            }
        },
        {
            field: "Region",
            minWidth: 100,
            filter: "agTextColumnFilter"
        },
        {
            field: "Longitude",
            minWidth: 75,
            filter: false
        },
        {
            field: "Latitude",
            minWidth: 75,
            filter: false
        },
        {
            field: "Frequency",
            minWidth: 50,
            filter: "agNumberColumnFilter",
            filterParams: {
                allowedCharPattern: '\\d\\-\\,', // note: ensure you escape as if you were creating a RegExp from a string
                numberParser: text => {
                    return text == null ? null : parseFloat(text.replace(',', '.'));
                }
            }
        }
    ];

    const onGridReady = params => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        RenderMap(params.api);
        params.api.addGlobalListener((type, event) => {
            switch (type) {
                case "filterChanged":
                    RenderMap(params.api);
                    return;
                default:
                    return null;
            }
        });
    };

    return (
        <div className="grid">
            <div className="grid-buttons">
                <button onClick={resetAppliedFilters} className="btn btn-md btn-danger">
                    Reset Filters
                </button>
                <button onClick={onExport} className="btn btn-md btn-success">
                    Export Filtered CSV
                </button>
                <div className="form-check">
                    <label className="form-check-label">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={showFreq}
                            onChange={handleFreqCheckBox}
                        />
                        Show Frequencies
                    </label>
                </div>
            </div>

            <div
                className={"ag-theme-balham"}
            >
                <AgGridReact
                    onGridReady={onGridReady}
                    rowData={rowData}
                    animateRows={true}
                    rowSelection="multiple"
                    defaultColDef={{
                        flex: 1,
                        minWidth: 100,
                        resizable: true,
                        sortable: true,
                        filter: false
                    }}
                    pagination
                    paginationPageSize={50}
                    columnDefs={cols}
                    frameworkComponents={{
                        agDateInput: DTPicker
                    }}
                />
            </div>
        </div >
    );
};
export default Grid;
