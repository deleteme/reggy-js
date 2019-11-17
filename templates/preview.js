import { html } from "https://cdn.jsdelivr.net/npm/lit-html@1.1.2/lit-html.js";
import { unsafeHTML } from "https://cdn.jsdelivr.net/npm/lit-html@1.1.2/directives/unsafe-html.js";

import { getRegExp } from "./selectors.js";

export const preview = state => {
  let content = "";
  const regexp = getRegExp(state);
  console.log(regexp);
  if (regexp instanceof RegExp) {
    const { testString } = state;
    const match = testString.match(regexp);
    console.log("match:", match);
    if (match) {
      const formatted = testString.replace(
        [...new Set(match)],
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
