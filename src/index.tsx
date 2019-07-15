// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// React
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './rootReducer';

// Loca
import { IntlProvider } from 'react-intl-redux'
import { init as initLoca } from './loca/loca';

// Style
import 'semantic-ui-css/semantic.min.css';

// Flags
import 'flag-icon-css/css/flag-icon.min.css'
import './style.css'

// App
import App from './App';
import { APP_PATH } from './utils/settings';

//* ////////////////////////////////////////////////////////
//*                     Implementation                    //
//* ////////////////////////////////////////////////////////
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
initLoca()(store.dispatch);

// App
ReactDOM.render(
    <Provider store={store}>
        <IntlProvider>
            <BrowserRouter forceRefresh={!('pushState' in window.history)} basename={APP_PATH}>
                <App />
            </BrowserRouter>
        </IntlProvider>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
