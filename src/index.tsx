// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// React
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { IReduxRootProps } from './rootReducer';

// Loca
import { init as initLoca } from './loca/loca';

import {connect} from "react-redux";
import {IntlProvider as ip} from "react-intl";



// Style
import 'semantic-ui-css/semantic.min.css';

// Flags
import 'flag-icon-css/css/flag-icon.min.css'
import './style.css'

// App
import App from './App';



const mapStateToProps = (state: IReduxRootProps): any => {
    const intl = state.intl;
    return {
        locale:intl.locale,
        messages: intl.messages
    }
  }

const IntlProvider = connect(mapStateToProps, null)(ip);
//* ////////////////////////////////////////////////////////
//*                     Implementation                    //
//* ////////////////////////////////////////////////////////
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
initLoca()(store.dispatch);

// App
ReactDOM.render(
    <Provider store={store}>
        <IntlProvider locale="de">
            <HashRouter /*forceRefresh={!('pushState' in window.history)} basename={APP_PATH}*/>
                <App />
            </HashRouter>
        </IntlProvider>
    </Provider>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
