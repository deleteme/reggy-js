const createStore = (reducer, initialState) => {
  let state = initialState;

  addEventListener('message', e => {
    state = reducer(state, e.data);
    postMessage({ type: 'PUBLISH', state });
  });

  postMessage({ type: 'PUBLISH', state });
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return action.initialState;
    case 'INPUT_CHANGED':
      return { ...state, [action.name]: action.value };
    default:
      return state;
  }
};

createStore(reducer, null);
