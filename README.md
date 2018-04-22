# react-suspense-redux-cache

Using redux with React suspense to store the cache.

**This is a joke!** Don't use it! Really! This is just meant to demostrate how easy it is to create cache providers for the new React "Suspense" feature 😅

## Examples

Install dependency:

```bash
yarn add react-suspense-redux-cache
# or
npm i react-suspense-redux-cache
```

And (DONT!) use in your app:

```js
import { combineReducers, createStore } from 'redux';
import React, { PureComponent, Fragment } from 'react';
import { cacheReducer as cache, createFetcher } from 'react-suspense-redux-cache';
import { Placeholder } from './somewhere-else';
// ^ really, there are 1000000 gists already, just google it

// Add to redux store
const store = createStore(
  combineReducers({ cache })
);

// Create data fetcher
const getUsers = createFetcher(store, () => 
  fetch('https://api.github.com/users')
    .then(r => r.json())
);

// User data fetcher in your component
class App extends PureComponent {
  render () {
    const users = getUsers().data;
    return (
      <Fragment>
        <h1>Example</h1>
        <ul>
          {users.map(user => (
            <li>{user.name}</li>
          ))}
        </ul>
      </Fragment>
    );
  }
}

// Invalidate cache
getUsers.invalidate(key); // specific entry
getUsers.invalidate(); // all entries in cache

// Render
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.unstable_AsyncMode>
    <Provider store={store}>
      <Placeholder delayMs={1000} fallback={<p>Loading....</p>}>
        <App />
      </Placeholder>
    </Provider>
  </React.unstable_AsyncMode>
);
```
