import { createStore, combineReducers, applyMiddleware } from 'redux';
import { identity } from 'lodash';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import fetchQuestionsSaga from './sagas/fetch-questions-saga';
import fetchQuestionSaga from './sagas/fetch-question-saga';
import * as reducers from './reducers';

// Special router for redux - deals automatically with link tags..
import { routerReducer as router, routerMiddleware } from 'react-router-redux';

export default function( history, defaultState ) {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = routerMiddleware(history);
  const middlewareChain = [middleware, sagaMiddleware];

  if(process.env.NODE_ENV === 'development') {
    const logger = createLogger();
    middlewareChain.push(logger);
  }

  const store = createStore(combineReducers({
    ...reducers,
    router  // router is now part of the state
  }), defaultState, applyMiddleware(...middlewareChain));
  sagaMiddleware.run(fetchQuestionsSaga);
  sagaMiddleware.run(fetchQuestionSaga);
  return store;
}

