import { html } from "../packages.js";
import { getRegExp, getMatch } from "../selectors.js";

// https://stackoverflow.com/questions/5499078/fastest-method-to-escape-html-tags-as-html-entities
const escapeElement = document.createElement("textarea");
const escapeHTML = html => {
  escapeElement.textContent = html;
  return escapeElement.innerHTML;
};

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

const format = (content, state) => {
  const regexp = getRegExp(state);
  if (regexp instanceof RegExp) {
    const match = getMatch(state)
    if (content.length > 0 && match) {
      console.log('match', match);
      const replacements = [];
      let i = 0;
      let lastOffset = 0;
      // the function formats and collects each match into replacements
      content = content.replace(regexp, function(m){
        const argsLength = arguments.length;
        const offset = arguments[argsLength - 2];
        const head = content.slice(lastOffset, offset);
        replacements.pop();// remove the tail
        replacements.push(
          html`${addLineBreakHTML(head)}`,
          html`<span class="match">${addLineBreakHTML(m)}</span>`
        );
        // if there's a tail, add it
        const tail = content.slice(offset + m.length);
        if (tail) replacements.push(html`${addLineBreakHTML(tail)}`);
        lastOffset = offset + m.length;
        i += 1;
        return '';
      });
      return replacements;
    }
  } else if (regexp instanceof Error) {
    return html`<span class="syntax-error">${regexp}</span>`;
  }

  content = addLineBreakHTML(content);
  return content;
};

export const preview = ({ state }) => {
  let content = escapeHTML(state.testString);
  content = format(content, state);
  // prettier-ignore
  return html`<div class="preview">${content}</div>`;
};
