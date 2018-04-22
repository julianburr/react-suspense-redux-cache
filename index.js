let i = 0;

const ACTION_ADD = 'cache/ADD';
const ACTION_INVALIDATE = 'cache/INVALIDATE';

// Reducer for the Redux store
function cacheReducer (state, action) {
  switch (action.type) {
    case ACTION_ADD:
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.data
      });
      break;

    case ACTION_INVALIDATE:
      if (action.payload && action.payload.key) {
        return Object.assign({}, state, {
          [action.payload.key]: undefined
        });
      }
      // If no key is provided just clear everything!
      return {};

    default:
      return {};
  }
}

function createFetcher (store, method, hash = (i) => i) {
  let cacheKey = ++i;

  function fetch () {
    const key = `${cacheKey}--${hash.apply(this, arguments)}`;
    const fromCache = store.getState().cache[key];
    if (!fromCache) {
      throw method.apply(this, arguments).then((response) => {
        return new Promise((resolve) => {
          store.dispatch({
            type: ACTION_ADD,
            payload: {
              key,
              data: response
            }
          });
          // The good ol' Redux workaround to make things async 😅
          // This will ensure that the promise resolves on the next tick,
          // where Redux will have updated the store correctly
          setTimeout(resolve, 0);
        });
      });
    }
    return fromCache;
  }

  fetch.invalidate = function invalidate (key) {
    store.dispatch({
      type: ACTION_INVALIDATE,
      payload: {
        key
      }
    });
  };

  return fetch;
}

module.exports = {
  createFetcher,
  cacheReducer
};
