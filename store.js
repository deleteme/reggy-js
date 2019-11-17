const initialState = {
  isGlobal: true,
  isCaseInsensitive: false,
  regExpString: "[aeiou]",
  testString: "bun lettuce tomato onion bacon cheese patty lettuce bun"
};

let state = initialState;

const anyValueIsDifferent = (oldState, newState) => {
  return Object.entries(newState).some(([key, value]) => {
    return oldState[key] !== value;
  });
};

export const setState = newState => {
  if (newState !== state && anyValueIsDifferent(state, newState)) {
    state = { ...state, ...newState };
  }
};

export const getState = () => state;
