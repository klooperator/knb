import React from 'react';
import { render } from 'react-dom';
import api from 'redux-rest-fetcher';

import App from './src/containers/App';
import calls from './src/api/Calls';

api.setBaseUrl('http://localhost:3333');
api.setBaseOptions({
  /* credentials: 'include', */
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Cache: 'no-cache',
    /* credentials: 'same-origin', */
  },
});
api.setEndpoints(calls);

api
  .ping()
  .then(r => r.text())
  .then((t) => {
    console.log(t);
  });

const CENTRAL_NODE = document.getElementById('app');

const renderApp = () => {
  render(<App />, CENTRAL_NODE);
};

renderApp();
