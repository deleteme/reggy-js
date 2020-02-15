import { html, createSelector, asyncAppend, guard } from "../packages.js";
import { getRegExp, getMatch } from "../selectors.js";

const log = (...values) => {
/*
  setTimeout(() => {
    console.log(...values);
  }, 0);
*/
};
// https://stackoverflow.com/questions/5499078/fastest-method-to-escape-html-tags-as-html-entities
const escapeElement = document.createElement("textarea");
const escapeHTML = html => {
  escapeElement.textContent = html;
  return escapeElement.innerHTML;
};

const getContent = state => state.testString;

// prettier-ignore
const _break = html`<br class="break" />`;
const breakSign = html`<span class="break-sign"></span>${_break}`;

const newLine = /\n/g;

const addLineBreakHTML = string => {
  return newLine.test(string)
    ? string.split(newLine).map(
        (line, i) =>
          // prettier-ignore
          html`${i > 0 ? _break : ""}${line}`
      )
    : string;
};

// prettier-ignore
const renderHead = head => html`${addLineBreakHTML(head)}`;
const renderTail = renderHead;
// prettier-ignore
const renderMatch = m => html`<span class="match">${addLineBreakHTML(m)}</span>`;
const instruction = (template, string) => ({ template, string });
const callTemplate = ({ template, string }) => template(string);

const memoizedFormat = createSelector(
  getContent,
  getRegExp,
  getMatch,
  function format(content, regexp, match) {
    if (regexp instanceof RegExp) {
      if (content.length > 0 && match) {
        log("match", match);
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
              instructions.push(
                instruction(renderTail, tail)
              );
              hasTailInInstructions = true;
            }
          }
          lastOffset = offset + m.length;
          i += 1;
          return "";
        });
        return { instructions };
      }
    } else if (regexp instanceof Error) {
      // prettier-ignore
      return { content: html`<span class="syntax-error">${regexp}</span>` };
    }

    content = addLineBreakHTML(content);
    return { content };
  }
);

const nextFrame = () => {
  log('next frame');
  return new Promise(requestAnimationFrame);
};

async function* renderMatchesAsync(replacementInstructions) {
  const max = 100;
  let i = 0;
  let bucket = []
  // render 100 templates per frame
  for (let instruction of replacementInstructions) {
    i += 1;
    if (i === max) {
      log('yield ', i, 'templates');
      yield bucket;
      //await nextFrame();
      bucket = [];
      i = 0;
    }
    bucket.push(callTemplate(instruction));
  }
  log('yield remaining templates with a bucket of length', bucket.length);
  yield bucket;
}

export const preview = ({ state }) => {
  const { content, instructions } = memoizedFormat(state);
  // prettier-ignore
  return html`
    <div class="preview"><div
      class="preview-interior"
      id="preview-interior"
      .scrollTop=${state.testStringPanelScrollTop}
    >${guard(
        [content, instructions],
        () => instructions
          ? asyncAppend(renderMatchesAsync(instructions))
          : content
      )}
    </div></div>`;
};

