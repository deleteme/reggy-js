import { html, unsafeHTML } from "../packages.js";
import { getRegExp } from "../selectors.js";

export const preview = ({ state}) => {
  let content = "";
  const regexp = getRegExp(state);
  console.log(regexp);
  if (regexp instanceof RegExp) {
    const { testString } = state;
    const match = testString.match(regexp);
    console.log("match:", match);
    if (match) {
      const formatted = testString.replace(
        match,
        `<span class="match">$&</span>`
      );
      content = unsafeHTML(formatted);
    } else {
      content = testString;
    }
  } else {
    content = unsafeHTML(`<span class="syntax-error">${regexp}</span>`);
  }
  return html`${content}`;
};
