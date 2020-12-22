import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import { BrowserRouter, Route } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
    <Route path={`/:city?`} component={App} />
  </BrowserRouter>,
  document.getElementById('root'),
);
