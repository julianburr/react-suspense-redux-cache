let i = 0;

function createFetcher (store, method, hash = (i) => i) {
  let cacheKey = ++i;
  return function fetch () {
    const key = `${cacheKey}--${hash.apply(this, arguments)}`;
    const fromCache = store.getState().cache[key];
    if (!fromCache) {
      throw method.apply(this, arguments).then((response) => {
        return new Promise((resolve) => {
          store.dispatch({
            type: 'cache/ADD',
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
  };
}

// Reducer for the Redux store
const cacheReducer = (state, action) => {
  switch (action.type) {
    case 'cache/ADD':
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.data
      });
      break;

    default:
      return {};
  }
};

module.exports = {
  createFetcher,
  cacheReducer
};
