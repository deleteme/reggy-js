const createStoreWorker = (path, reducer, initialState) => {
  const worker = new Worker(path);
  let state = initialState;
  const subscribers = new Set();
  const getState = () => state;
  const reduceAndNotify = action => {
    state = reducer(state, action);
    for (let callback of subscribers) callback();
  };
  const dispatch = (action, isAsync = true) => {
    if (isAsync) {
      worker.postMessage(action);
    } else {
      reduceAndNotify(action);
    }
  };
  const subscribe = callback => subscribers.add(callback);
  worker.addEventListener("message", function handleWorkerMessage(e) {
    reduceAndNotify(e.data);
  });
  return { dispatch, getState, subscribe };
};

const initialState = {
  global: true,
  ignoreCase: false,
  instructions: null,
  multiline: false,
  regExpString: "[a-z]{4,}",
  testString:
    "This is a string that will be highlighted when your regular expression matches something.",
  testStringPanelScrollTop: 0
};
const reducer = (state, action) => {
  switch (action.type) {
    case "PUBLISH":
      return { ...state, ...action.state };
    case "INPUT_CHANGED":
      return { ...state, [action.name]: action.value };
    case "PASTE":
      return { ...state, didRecentlyPaste: action.didRecentlyPaste };
    default:
      return state;
  }
};

export const { dispatch, getState, subscribe } = createStoreWorker(
  "/store-worker.js",
  reducer,
  initialState
);

const MAIN_THREAD_FIELDS = new Set(["testStringPanelScrollTop"]);

const WORKER_FIELDS = new Set(
  Object.keys(initialState).filter(name => !MAIN_THREAD_FIELDS.has(name))
);

// send worker fields
dispatch({
  type: "INIT",
  initialState: Object.entries(initialState).reduce(
    (storeWorkerInitialState, [name, value]) => {
      if (WORKER_FIELDS.has(name)) {
        storeWorkerInitialState[name] = value;
      }
      return storeWorkerInitialState;
    },
    {}
  )
});
