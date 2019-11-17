const initialState = {
  isGlobal: true,
  isCaseInsensitive: false,
  regexString: '[aeiou]',
  testString: 'bun lettuce tomato onion bacon cheese patty lettuce bun'
};

let state = initialState;

export const setState = newState => {
  state = { ...state, ...newState };
};

export const getState = () => state;