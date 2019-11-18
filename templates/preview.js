import { html, unsafeHTML } from "../packages.js";
import { getRegExp, getMatch } from "../selectors.js";

export const preview = ({ state }) => {
  let content = "";
  const regexp = getRegExp(state);
  console.log(regexp);
  if (regexp instanceof RegExp) {
    const match = getMatch(state);
    console.log("match:", match);
    if (match) {
      const formatted = state.testString.replace(
        regexp,
        `<span class="match">$&</span>`
      );
      content = unsafeHTML(formatted);
    } else {
      content = state.testString;
    }
  } else {
    content = unsafeHTML(`<span class="syntax-error">${regexp}</span>`);
  }
  return html`${content}`;
};
