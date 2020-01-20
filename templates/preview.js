import { html, unsafeHTML } from "../packages.js";
import { getRegExp, getMatch } from "../selectors.js";

// https://stackoverflow.com/questions/5499078/fastest-method-to-escape-html-tags-as-html-entities
const escapeElement = document.createElement("textarea");
const escapeHTML = html => {
  escapeElement.textContent = html;
  return escapeElement.innerHTML;
};

const addLineBreaks = string =>
  string.replace(/\n/g, `<span class="break-sign"></span><br class="break" />`);

const format = (content, state) => {
  const regexp = getRegExp(state);
  if (regexp instanceof RegExp) {
    if (content.length > 0 && getMatch(state)) {
      content = content.replace(regexp, `<span class="match">$&</span>`);
    }
  } else if (regexp instanceof Error) {
    content = `<span class="syntax-error">${regexp}</span>`;
  }

  return content;
};

export const preview = ({ state }) => {
  let content = escapeHTML(state.testString);
  content = format(content, state);
  content = addLineBreaks(content);
  content = unsafeHTML(content);
  // prettier-ignore
  return html`${content}`;
};
