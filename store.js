const initialState = {
  global: true,
  isCaseInsensitive: false,
  regExpString: "[aeiou]",
  testString: "bun lettuce tomato onion bacon cheese patty lettuce bun"
};

let state = initialState;

const isAnyValueDifferent = (oldState, newState) => {
  return Object.entries(newState).some(([key, value]) => {
    return oldState[key] !== value;
  });
};

export const setState = newState => {
  if (newState !== state && isAnyValueDifferent(state, newState)) {
    state = { ...state, ...newState };
    console.log(state);
  }
};

export const getState = () => state;
