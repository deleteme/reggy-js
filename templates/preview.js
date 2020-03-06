import { html, createSelector } from "../packages.js";
import { getRegExp } from "../selectors.js";


const getContent = createSelector(state => state.testString, testString => {
  const needsExtraTrailingNewLine = testString.endsWith('\n') && !testString.endsWith('\n\n')
  return needsExtraTrailingNewLine
    ? `${testString}\n`
    : testString;
});

// prettier-ignore
const _break = html`<br class="break" />`;
// eslint-disable-next-line
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
const renderHead = head => addLineBreakHTML(head);
const renderTail = renderHead;
// prettier-ignore
const renderMatch = m => html`<span class="match">${addLineBreakHTML(m)}</span>`;
const templateMap = [renderHead, renderMatch, renderTail];
const callTemplate = ([templateType, string]) => {
  const template = templateMap[templateType];
  return template(string);
}


const getFallbackContent = createSelector(
  getContent,
  getRegExp,
  function _getFallbackContent(content, regExp) {
    if (regExp instanceof Error) {
      // prettier-ignore
      return html`<span class="syntax-error">${regExp}</span>`;
    } else {
      return addLineBreakHTML(content);
    }
  }
);

export const preview = ({ state }) => {
  const { instructions } = state;
  // prettier-ignore
  return html`
    <div class="preview"><div
      class="preview-interior"
      id="preview-interior"
    >${instructions
        ? instructions.map(callTemplate)
        : getFallbackContent(state)
    }</div></div>`;
};

