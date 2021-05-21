/**
 * https://cdn.jsdelivr.net/npm/reselect@4.0.0/es/index.min.js
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/reselect@4.0.0/es/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
function defaultEqualityCheck(e,r){return e===r}function areArgumentsShallowlyEqual(e,r,t){if(null===r||null===t||r.length!==t.length)return!1;for(var n=r.length,o=0;o<n;o++)if(!e(r[o],t[o]))return!1;return!0}function defaultMemoize(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:defaultEqualityCheck,t=null,n=null;return function(){return areArgumentsShallowlyEqual(r,t,arguments)||(n=e.apply(null,arguments)),t=arguments,n}}function getDependencies(e){var r=Array.isArray(e[0])?e[0]:e;if(!r.every(function(e){return"function"==typeof e})){var t=r.map(function(e){return typeof e}).join(", ");throw new Error("Selector creators expect all input-selectors to be functions, instead received the following types: ["+t+"]")}return r}function createSelectorCreator(e){for(var r=arguments.length,t=Array(r>1?r-1:0),n=1;n<r;n++)t[n-1]=arguments[n];return function(){for(var r=arguments.length,n=Array(r),o=0;o<r;o++)n[o]=arguments[o];var u=0,l=n.pop(),a=getDependencies(n),c=e.apply(void 0,[function(){return u++,l.apply(null,arguments)}].concat(t)),i=e(function(){for(var e=[],r=a.length,t=0;t<r;t++)e.push(a[t].apply(null,arguments));return c.apply(null,e)});return i.resultFunc=l,i.dependencies=a,i.recomputations=function(){return u},i.resetRecomputations=function(){return u=0},i}}var createSelector=createSelectorCreator(defaultMemoize);function createStructuredSelector(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:createSelector;if("object"!=typeof e)throw new Error("createStructuredSelector expects first argument to be an object where each property is a selector, instead received a "+typeof e);var t=Object.keys(e);return r(t.map(function(r){return e[r]}),function(){for(var e=arguments.length,r=Array(e),n=0;n<e;n++)r[n]=arguments[n];return r.reduce(function(e,r,n){return e[t[n]]=r,e},{})})}


const CHARACTER_WIDTH = 15;
const LINE_HEIGHT = 26;

const createStore = (reducer, initialState) => {
  let state = initialState;

  addEventListener("message", e => {
    state = reducer(state, e.data);
    postMessage({ type: "PUBLISH", state });
  });

  postMessage({ type: "PUBLISH", state });
};

const inputChangedReducer = (state, action) => {
  return { ...state, [action.name]: action.value };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        ...action.initialState,
        instructions: memoizedCreateVisibleInstructions(action.initialState)
      };
    case "INPUT_CHANGED":
      return instructionsReducer(state, action);
    case "MEASURE_PREVIEW":
      return measurePreviewReducer(state, action);
    default:
      return state;
  }
};

const measurePreviewReducer = (state, action) => {
  //console.log('measurePreviewReducer called with', action);
  const newState = {
    ...state,
    areaHeight: action.areaHeight,
    areaWidth: action.areaWidth
  };
  //console.log('newState', newState);
  const instructions = memoizedCreateVisibleInstructions(newState);
  return { ...newState, instructions };
};

const instructionsReducer = (state, action) => {
  const newState = inputChangedReducer(state, action);
  const instructions = memoizedCreateVisibleInstructions(newState);
  return { ...newState, instructions };
};

const instruction = (templateType, string) => [templateType, string];
const [renderHead, renderMatch, renderTail] = [0, 1, 2];

const createInstructions = (content, regexp, match) => {
  if (regexp instanceof RegExp && content.length > 0 && match) {
    const instructions = [];
    let i = 0;
    let lastOffset = 0;
    let hasTailInInstructions = false;
    // the function formats and collects each match into instructions
    content = content.replace(regexp, function replace(m) {
      const argsLength = arguments.length;
      const offset = arguments[argsLength - 2];
      const head = content.slice(lastOffset, offset);
      const needsTailInInstructions = match.length - i < 3;
      if (hasTailInInstructions) instructions.pop(); // remove the tail
      instructions.push(
        instruction(renderHead, head),
        instruction(renderMatch, m)
      );
      // if approaching the end of the matches, add the tail
      if (needsTailInInstructions) {
        // if there's a tail, add it
        const tail = content.slice(offset + m.length);
        if (tail) {
          instructions.push(instruction(renderTail, tail));
          hasTailInInstructions = true;
        }
      }
      lastOffset = offset + m.length;
      i += 1;
      return "";
    });
    return instructions;
  }
  return null;
};

const getFlags = createStructuredSelector({
  g: state => state.global,
  i: state => state.ignoreCase,
  m: state => state.multiline
});

const makeClassMap = delimiter => map => {
  return Object.entries(map)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(delimiter);
};
const getFlagsString = createSelector(getFlags, makeClassMap(""));

const getRegExp = createSelector(
  state => state.regExpString,
  getFlagsString,
  (regExpString, flags) => {
    if (regExpString.length === 0) return null;
    try {
      return new RegExp(regExpString, flags);
    } catch (error) {
      return error;
    }
  }
);

const getMatch = createSelector(
  state => state.testString,
  getRegExp,
  (testString, regexp) => {
    return regexp instanceof RegExp ? testString.match(regexp) : null;
  }
);

const getContent = createSelector(
  state => state.testString,
  testString => {
    const needsExtraTrailingNewLine =
      testString.endsWith("\n") && !testString.endsWith("\n\n");
    return needsExtraTrailingNewLine ? `${testString}\n` : testString;
  }
);

const memoizedCreateInstructions = createSelector(
  getContent,
  getRegExp,
  getMatch,
  createInstructions
);
const testResults = [];
const assert = (message, value, expected) => {
  if (value === expected) {
    // ok
    testResults.push(`assertion ok: ${message}. Expected: "${expected}". Received: "${value}".`);
  } else {
    testResults.push(new Error(`assertion failed: ${message}. Expected: "${expected}". Received: "${value}".`));
  }
};

const xassert = () => {};



const NL = /\n/g;
const NLs = '\n';

const isWithin = (a, b, c) => a <= b && b <= c;

const getLinesRegExp = col => {
  //const reg = new RegExp(`\n?.{1,${col}}|\n$`, 'g')
  //const reg = new RegExp(`(.{1,${col}})( +|$)\n?|(.{1,${col}})`, 'g')
  //const reg = new RegExp(`\n?(.{1,${col}})( +|$)|(.{1,${col}})`, 'g')
  //const reg = new RegExp(`(.{1,${col - 1}}\s)|(.{1,${col}})`, 'g');
  //const reg = new RegExp(`(.{1,${col - 1}} )|(\n.{1,${col}})|(\n$)|(.{1,${col}})`, 'g');
  //const reg = new RegExp(`(\n.{1,${col - 1}} )|(\n(?:$|\n))|(.{1,${col}})`, 'g');
  const reg = new RegExp(`(\n.{1,${col - 1}} )|(\n(?:$|\n))|(\\S.{0,${col - 1}})`, 'g');
  return reg;

  //let regexString = '.{1,' + col + '}';
  //regexString += '([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)';
  //return new RegExp(regexString, 'g');
};

const countLines = (string, columns) => {
  const reg = getLinesRegExp(columns);
  return [...string.matchAll(reg)].length;
};

assert('one line: xxxx', countLines('xxxx', 5), 1);
assert('one line: xxxxx', countLines('xxxxx', 5), 1);
xassert('one line: \n\n', countLines('\n\n', 5), 1);
assert('two lines: xxxx\n', countLines('xxxx\n', 5), 2);
assert('two short lines: xx\nxx', countLines('xx\nxx', 5), 2);
assert('two lines: 1xxxx2', countLines('1xxxx2', 5), 2);
assert('two lines: xxxxx\n', countLines('xxxxx\n', 5), 2);
assert('two lines: xxxxx\nxxxx', countLines('xxxxx\nxxxx', 5), 2);
assert('two lines: xxxxx\nxxxxx', countLines('xxxxx\nxxxxx', 5), 2);
assert('two lines: xxxxxxxxxx', countLines('xxxxxxxxxx', 5), 2);
assert('three lines: 11111222223', countLines('11111222223', 5), 3);
assert(`fifteen lines: 1
2
3
4
5
6
7
8
9
10
11
12
13
14
15`,
  countLines(`1
2
3
4
5
6
7
8
9
10
11
12
13
14
15`, 10), 15);
assert(
  `eight lines: Two Cities\nFrom Wikipedia, the free encyclopedia\nJump to navigation`,
  countLines(
    `Two Cities\nFrom Wikipedia, the free encyclopedia\nJump to navigation`,
    10),
  8
);

(() => {
  const reg = getLinesRegExp(10)
  const str = `A Tale of Two Cities\nFrom Wikipedia,`;
  const lines = str.match(reg);
  assert('A Tale of ', lines[0], 'A Tale of ');
  assert('Two Cities', lines[1], 'Two Cities');
  assert('\nFrom ', lines[2], '\nFrom ');
  assert('Wikipedia,', lines[3], 'Wikipedia,');
})();

assert(
  `four lines: A Tale of Two Cities\nFrom Wikipedia,`,
  countLines(`A Tale of Two Cities\nFrom Wikipedia,`, 10),
  4
);

// tests that spaces will be collapsed
assert(`15 lines: 1ongreader 2ongreader 3ongreader 4ongreader 5ongreader 6ongreader7ongreader 8ongreader 9ongreader 10ngreader 11ngreader 12ngreader 13ngreader 14ngreader 15ngreader`,
  countLines(`1ongreader 2ongreader 3ongreader 4ongreader 5ongreader 6ongreader7ongreader 8ongreader 9ongreader 10ngreader 11ngreader 12ngreader 13ngreader 14ngreader 15ngreader`, 10),
  15
);

testResults.forEach(result => {
  if (result instanceof Error) {
    console.error(result);
  } else {
    console.log(result);
  }
});

const isDef = value => typeof value !== "undefined";

const createVisibleInstructions = (
  originalContent,
  regexp,
  areaHeight,
  areaWidth,
  scrollTop
) => {
  if (
    originalContent.length > 0 &&
    areaHeight &&
    areaWidth &&
    isDef(scrollTop)
  ) {
    const enableLogging = true;
    let content = originalContent;
    const columns = Math.round(areaWidth / CHARACTER_WIDTH);
    const rows = Math.ceil(areaHeight / LINE_HEIGHT);
    const scrollPercentage = Math.abs(scrollTop) / areaHeight;
    const indexOfFirstVisibleLine = Math.floor(scrollTop / LINE_HEIGHT);
    const indexOfLastVisibleLine = indexOfFirstVisibleLine + rows;// add an extra visible row?
    if (enableLogging) console.log('indexOfFirstVisibleLine', indexOfFirstVisibleLine, 'indexOfLastVisibleLine', indexOfLastVisibleLine);

    let instructions = [];
    let i = 0;
    let lastOffset = 0;
    let hasTailInInstructions = false;
    let hasAlreadyPaddedFirstLine = false;

    const countLinesRegExp = getLinesRegExp(columns);

    const linesIterator = originalContent.matchAll(countLinesRegExp);

    function* matchGenerator() {
      if (regexp instanceof RegExp) {
        if (regexp.global) {
          yield* originalContent.matchAll(regexp);
        } else {
          yield* [originalContent.match(regexp)];
        }
      }
      yield* [];
    }

    function* visibleLineGenerator(){
      let didReachStartOfVisibleBlock = false;
      let lineIndex = 0;
      for (const line of linesIterator) {
        const isVisible = indexOfFirstVisibleLine <= lineIndex && lineIndex <= indexOfLastVisibleLine;
        const lineContent = line[0];
        if (isVisible) {
          if (!didReachStartOfVisibleBlock) didReachStartOfVisibleBlock = true;
          yield { line };
        } else {
          if (didReachStartOfVisibleBlock) {
            break;
          }
        }
        lineIndex += 1;
      }
    }

    function* matchesInViewport (start, end) {
      let didEnterRange = false;
      for (const match of matchGenerator()) {
        const matchEnd = match.index + match[0].length - 1;
        if (matchEnd >= start && match.index < end) {
          // in bounds
          if (!didEnterRange) didEnterRange = true;
          yield match;
        } else {
          // out of bounds
          if (didEnterRange) {
            // matches to be in bounds, but now have a match that is past that
            // and the for loop can be stopped early.
            break;
          }
        }
      }
    }

    function* generateInstructions() {
      let contentForLineIterator;
      const visibleLines = [...visibleLineGenerator()].map(({ line }) => line);
      console.log('visibleLines', visibleLines);
      if (visibleLines.length > 0) {
        const firstLine = visibleLines[0];
        const firstLineStart = firstLine.index;
        const lastLine = visibleLines[visibleLines.length - 1];
        const lastLineEnd = lastLine.index + lastLine[0].length;

        const matches = matchesInViewport(firstLineStart, lastLineEnd);

        let lastIndex = firstLineStart;

        for (const match of matches) {
          const matchContent = match[0];
          const headIndex = lastIndex;
          const headEnd = match.index;
          const hasHead = headIndex !== headEnd;
          const head = hasHead && originalContent.slice(headIndex, headEnd);
          if (hasHead) yield instruction(renderHead, head);
          yield instruction(renderMatch, matchContent);
          lastIndex = match.index + matchContent.length;
        }

        if (lastIndex <= lastLineEnd) {
          const tail = originalContent.slice(lastIndex, lastLineEnd);
          yield instruction(renderTail, tail);
        }
      } else {
        // yield [];// no visible lines. yield an empty array
      }
    }


    instructions = [...generateInstructions()];

    // a hack to remove a leading new line
    ((firstInstruction) => {
      if (firstInstruction) {
        const content = firstInstruction[1];
        if (content?.startsWith(NLs)) {
          firstInstruction[1] = content.replace(NLs, '')
        }
      }
    })(instructions[0]);




    if (enableLogging) {
      //console.log('not visible instructions', notVisible);
      console.log("instructions", instructions.map(i => ({template:'hmt'[i[0]],content: i[1]})));
    }
    return instructions;
  }
  return null;
};

const memoizedCreateVisibleInstructions = createSelector(
  getContent,
  getRegExp,
  s => s.areaHeight,
  s => s.areaWidth,
  s => s.asyncScrollTop,
  createVisibleInstructions
);

createStore(reducer, null);
