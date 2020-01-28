import { html, createSelector } from "../packages.js";
import { getRegExp, getMatch } from "../selectors.js";

// https://stackoverflow.com/questions/5499078/fastest-method-to-escape-html-tags-as-html-entities
const escapeElement = document.createElement("textarea");
const escapeHTML = html => {
  escapeElement.textContent = html;
  return escapeElement.innerHTML;
};

const getContent = createSelector(
  state => state.testString,
  escapeHTML
);

// prettier-ignore
const breakSign = html`<span class="break-sign"></span><br class="break" />`;

const newLine = /\n/g;

const addLineBreakHTML = string => {
  return newLine.test(string)
    ? string.split(newLine).map(
        (line, i) =>
          // prettier-ignore
          html`${i > 0 ? breakSign : ""}${line}`
      )
    : string;
};

const memoizedFormat = createSelector(
  getContent,
  getRegExp,
  getMatch,
  function format(content, regexp, match) {
    if (regexp instanceof RegExp) {
      if (content.length > 0 && match) {
        console.log("match", match);
        const replacements = [];
        let i = 0;
        let lastOffset = 0;
        let hasTailInReplacements = false;
        // the function formats and collects each match into replacements
        content = content.replace(regexp, function replace(m) {
          const argsLength = arguments.length;
          const offset = arguments[argsLength - 2];
          const head = content.slice(lastOffset, offset);
          const needsTailInReplacements = match.length - i < 3;
          if (hasTailInReplacements) replacements.pop(); // remove the tail
          replacements.push(
            // prettier-ignore
            html`${addLineBreakHTML(head)}`,
            // prettier-ignore
            html`<span class="match">${addLineBreakHTML(m)}</span>`
          );
          // if approaching the end of the matches, add the tail
          if (needsTailInReplacements) {
            // if there's a tail, add it
            const tail = content.slice(offset + m.length);
            if (tail) {
              replacements.push(
                // prettier-ignore
                html`${addLineBreakHTML(tail)}`
              );
              hasTailInReplacements = true;
            }
          }
          lastOffset = offset + m.length;
          i += 1;
          return "";
        });
        return replacements;
      }
    } else if (regexp instanceof Error) {
      // prettier-ignore
      return html`<span class="syntax-error">${regexp}</span>`;
    }

    content = addLineBreakHTML(content);
    return content;
  }
);

export const preview = ({ state }) => {
  const content = memoizedFormat(state);
  // prettier-ignore
  return html`
    <div
      class="preview"
      .scrollTop=${state.testStringPanelScrollTop}
    >${content}</div>`;
};

