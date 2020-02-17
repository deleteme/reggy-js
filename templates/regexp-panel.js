import { html, repeat } from "../packages.js";

const flag = ({ state, dispatch, field }) => {
  const { name, label } = field;
  return html`
    <input
      type="checkbox"
      id=${name}
      name=${name}
      @change=${e => {
        dispatch({ type: 'INPUT_CHANGED', name, value: e.target.checked });
      }}
      .checked=${state[name]}
    />
    <label for="${name}">
      <small>${label}</small>
    </label>
  `;
};

const flags = ({ state, dispatch, flags }) => {
  return html`<div class="flags">${repeat(
    flags,
    ({ name }) => name,
    // prettier-ignore
    field => html`${flag({ state, dispatch, field })}`
  )}</div>`;
};

export const regExpPanel = ({ state, dispatch, handler }) => {
  // prettier-ignore
  return html`
    <section class="panel regexp-panel">
      <label class="label" for="regexp-string">Regular Expression</label>
      <textarea
        name="regExpString"
        id="regexp-string"
        class="textarea"
        @keyup=${handler}
        @change=${handler}
        spellcheck="false"
      >${state.regExpString}</textarea>
    ${flags({ state, dispatch, flags: [
      { name: "global", label: "Global" },
      { name: "ignoreCase", label: "Ignore Case" },
      { name: "multiline", label: "Multiline" },
    ] })}
    </section>
  `;
};
