import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/reducers.js';
import devTools from 'remote-redux-devtools';
import persistState from '../middleware/persistState';

const devToolsMiddleware = devTools({
    name: 'StockFlux',
    realtime: true,
    hostname: 'localhost',
    port: 8000
});

const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(thunkMiddleware, createLogger()),
    // Required! Enable Redux DevTools with the monitors you chose
    devToolsMiddleware,
    persistState()
);

function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        enhancer
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers/reducers', () => {
            const nextRootReducer = require('../reducers/reducers').default; // eslint-disable-line global-require
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}

export default configureStore;