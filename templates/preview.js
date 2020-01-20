import { html, unsafeHTML } from "../packages.js";
import { getRegExp, getMatch } from "../selectors.js";

const addLineBreaks = string =>
  string.replace(/\n/g, `<span class="break-sign"></span><br class="break" />`);

export const preview = ({ state }) => {
  let content = state.testString;
  const regexp = getRegExp(state);
  console.log(regexp);
  if (regexp instanceof RegExp) {
    const match = getMatch(state);
    console.log("match:", match);
    if (match) {
      content = state.testString.replace(
        regexp,
        `<span class="match">$&</span>`
      );
    }
  } else {
    content = `<span class="syntax-error">${regexp}</span>`;
  }
  content = addLineBreaks(content);
  content = unsafeHTML(content);
  // prettier-ignore
  return html`${content}`;
};
