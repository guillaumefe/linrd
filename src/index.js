import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store, persistor } from './app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import Loading from 'react-loading';
import * as serviceWorker from './serviceWorker';

import sha256 from 'js-sha256'
import Cookies from 'js-cookie';

const onBeforeLift = () => {
  // take some action before the gate lifts
}


// basic access mecanism
let keypass = null
let pass = ""
if ( ! Cookies.get('keypass')) {

    ReactDOM.render(
        <React.StrictMode>
        Please set a new password
        </React.StrictMode>,
        document.getElementById('root')
    );

    keypass = prompt("Passphrase");
    Cookies.set('keypass', sha256(keypass))
    pass = keypass

} else {
    keypass = Cookies.get('keypass');
    let test = "";
    while (sha256(test) !== keypass) {
        ReactDOM.render(
            <React.StrictMode>
            This pipeline is protected
            </React.StrictMode>,
            document.getElementById('root')
        );

        test = prompt("Passphrase");
    }

    pass = test
}

const _store = store(pass)

ReactDOM.render(
    <React.StrictMode>
    <Provider store={_store}>
    <PersistGate 
    loading={<Loading type={"balls"} color={"#333"} height={"20%"} width={"100%"} />}
    onBeforeLift={onBeforeLift}
    persistor={persistor(_store)}>
    <App />
    </PersistGate>
    </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
