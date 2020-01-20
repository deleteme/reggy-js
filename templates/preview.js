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

export const preview = ({ state }) => {
  console.log("state", state);
  let content = escapeHTML(state.testString);
  const regexp = getRegExp(state);
  console.log(regexp);
  if (regexp !== null) {
    if (regexp instanceof RegExp) {
      if (content.length > 0) {
        const match = getMatch(state);
        console.log("match:", match);
        if (match) {
          content = content.replace(regexp, `<span class="match">$&</span>`);
        }
      }
    } else {
      content = `<span class="syntax-error">${regexp}</span>`;
    }
  }
  content = addLineBreaks(content);
  content = unsafeHTML(content);
  // prettier-ignore
  return html`${content}`;
};
