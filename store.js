const longString = `Pride and Prejudice
From Wikipedia, the free encyclopedia
Jump to navigationJump to search
This article is about the novel. For other uses, see Pride and Prejudice (disambiguation).
Pride and Prejudice
PrideAndPrejudiceTitlePage.jpg
`;

const initialState = {
  global: true,
  ignoreCase: false,
  multiline: false,
  regExpString: "[a-z]{4,}",
  //testString: "This is a string that will be highlighted when your regular expression matches something."
  testString: longString.repeat(2),
  testStringPanelScrollTop: 0
};

let state = initialState;

const subscribers = new Set();

const isAnyValueDifferent = (oldState, newState) => {
  return Object.entries(newState).some(([key, value]) => {
    return oldState[key] !== value;
  });
};

export const setState = newState => {
  if (newState !== state && isAnyValueDifferent(state, newState)) {
    state = { ...state, ...newState };
    console.log('state', state);
    queueMicrotask(() => {
      subscribers.forEach(invoke);
    });
  }
};

export const getState = () => state;

const invoke = callback => callback({
  state: getState(), setState
});

export const subscribe = callback => {
  subscribers.add(callback);
  invoke(callback);
  return () => {
    subscribers.delete(callback);
  };
}
