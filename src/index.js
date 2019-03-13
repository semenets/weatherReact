import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route } from "react-router-dom"
import createBrowserHistory from "history/createBrowserHistory"

import './index.css';
import App from './App';
import City from './City'
import * as serviceWorker from './serviceWorker';

import { Provider } from "react-redux"
import { createStore, compose } from "redux"
import persistState from 'redux-localstorage'

import rootReducer from "./reducer"

const enhancer = compose(
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
	persistState(),
)

const store = createStore(rootReducer, enhancer)
const history = createBrowserHistory();

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<React.Fragment>
				<Route exact path="/" component={App}/>
				<Route exact path="/city/:cityName" component={City} />
			</React.Fragment>
		</Router>
	</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
