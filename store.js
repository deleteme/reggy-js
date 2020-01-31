import { createStore } from "./packages.js";

const initialState = {
  global: true,
  ignoreCase: false,
  multiline: false,
  regExpString: "[a-z]{4,}",
  testString:
    "This is a string that will be highlighted when your regular expression matches something.",
  testStringPanelScrollTop: 0
};

let state = initialState;

const rootReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGED":
      return { ...state, [action.name]: action.value };
    default:
      return state;
  }
};

export const store = createStore(
  rootReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
