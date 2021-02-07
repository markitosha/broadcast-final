import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// @ts-ignore
import {setBasepath} from "hookrouter";
import {uris} from "./constants";
import Cookies from "js-cookie";

const detectBasePath = () => {
    const pathname = document.location.pathname;

    for (let uri of uris) {
        if (pathname.includes(uri)) {
            return uri;
        }
    }

    return '/premier/center';
};

const path = detectBasePath();

setBasepath(path);

if (!Cookies.get('partner')) {
    Cookies.set('partner', path);
}

ReactDOM.render(
  <>
    <App />
  </>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
