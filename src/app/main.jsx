import * as React from 'react';
import {createRoot} from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import CsvLoader from './CsvLoader';
import "../style.css";

let root = createRoot(document.getElementById('csv_loader'));
root.render(
  <BrowserRouter>
    <CsvLoader />
  </BrowserRouter>
);
