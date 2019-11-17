import { html } from "../packages.js";

const flag = ({ state, setState, field }) => {
  return html`
    <input
      type="checkbox"
      id=${field.name}
      name=${field.name}
      @change=${e => {
        setState({ [field.name]: e.target.checked });
      }}
      .checked=${state.global}
    />
    <label for="${field.name}">
      ${field.label}
    </label>
  `;
};

export const regExpPanel = ({ state, setState, handler }) => {
  return html`
    <section class="panel regexp-panel">
      <label for="regexp-string">Regular Expression</label>
      <textarea
        name="regExpString"
        id="regexp-string"
        class="field"
        @keyup=${handler}
        @change=${handler}
      >
${state.regExpString}</textarea
      >
    </section>
    ${flag({ state, setState, field: { name: "global", label: "Global" } })}
  `;
};
