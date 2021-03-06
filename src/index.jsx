import App from './App';
import ReactDOM from 'react-dom';
import React from 'react'
import getStore from './getStore';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

const store = getStore(history);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });
}

const render = (_App) => (
  ReactDOM.render(
    <Provider store={store} >
      <ConnectedRouter history={history} >
       <_App />
      </ConnectedRouter>
    </Provider>, 
    document.getElementById('AppContainer')
  )
);

const fetchDataForLocation = location  => {
  if(location.pathname === '/') {
     store.dispatch({type: `REQUEST_FETCH_QUESTIONS`});
  } 
  
  if (location.pathname.includes(`questions`)) {
    store.dispatch({type: `REQUEST_FETCH_QUESTION`,
      question_id:location.pathname.split('/')[2] });
  }
}



//render(App);

// This is for the client app to wait for the server to render.
// It should not render until the server grabbed the data.
store.subscribe(() => {
  const state = store.getState();
  if (state.questions.length > 0){
    console.log("Mounting app");
    render(App);
  } else {
    console.log("App not yet mounting");
  }
})

fetchDataForLocation(history.location);
history.listen(fetchDataForLocation);