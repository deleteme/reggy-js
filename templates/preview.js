import { html, unsafeHTML } from "../packages.js";
import { getRegExp, getMatch } from "../selectors.js";

const addLineBreaks = string => {
  return string.replace(
    /\n/g,
    `<span class="break-sign"></span><br class="break" />`
  );
};

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
      content = unsafeHTML(addLineBreaks(formatted));
    } else {
      content = unsafeHTML(addLineBreaks(state.testString));
    }
  } else {
    content = unsafeHTML(`<span class="syntax-error">${regexp}</span>`);
  }
  // prettier-ignore
  return html`${content}`;
};
