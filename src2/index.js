import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './app/App';
import { store, persistor } from './app/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import Loading from 'react-loading';
import * as serviceWorker from './serviceWorker';

const onBeforeLift = () => {
  // take some action before the gate lifts
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate 
        loading={<Loading type={"balls"} color={"#333"} height={667} width={"100%"} />}
        onBeforeLift={onBeforeLift}
        persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
