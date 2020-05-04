const createStoreWorker = (path, reducer, initialState) => {
  const worker = new Worker(path);
  let state = initialState;
  const subscribers = new Set();
  const getState = () => state;
  const reduceAndNotify = action => {
    state = reducer(state, action);
    for (let callback of subscribers) callback({ dispatch, getState, action });
  };
  const dispatch = (action, isAsync = true) => {
    //console.log('dispatch:', action, isAsync);
    if (isAsync) {
      worker.postMessage(action);
    } else {
      reduceAndNotify(action);
    }
  };
  const subscribe = callback => {
    subscribers.add(callback);
    const unsubscribe = () => subscribers.delete(callback);
    return unsubscribe;
  };
  worker.addEventListener("message", function handleWorkerMessage(e) {
    reduceAndNotify(e.data);
  });
  return { dispatch, getState, subscribe };
};

const shortTestString = "0123456789";
const testStringThatGoesLong = `123456789022345678903234567890423456789052345678906234567890723456789082345678909234567890023456789012345678902234567890323456789042345678905234567890`
const testStringWithCollapsedLeadingSpaces = `1ongreader 2ongreader 3ongreader 4ongreader 5ongreader 6ongreader7ongreader 8ongreader 9ongreader 10ngreader 11ngreader 12ngreader 13ngreader 14ngreader 15ngreader`;

const initialState = {
  debug: window.location.search.includes('debug=1'),
  global: true,
  ignoreCase: false,
  instructions: null,
  multiline: false,
  //regExpString: "[a-z]{4,}",
  regExpString: "\\d{10}",
  //testString:
    //"This is a string that will be highlighted when your regular expression matches something.",
  testString: testStringWithCollapsedLeadingSpaces,
  testStringPanelScrollTop: 0,
  asyncScrollTop: 0,
  areaHeight: null,
  areaWidth: null
};
const reducer = (state, action) => {
  switch (action.type) {
    case "PUBLISH":
      return { ...state, ...action.state };
    case "INPUT_CHANGED":
      return { ...state, [action.name]: action.value };
    default:
      return state;
  }
};

export const { dispatch, getState, subscribe } = createStoreWorker(
  "./store-worker.js",
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
