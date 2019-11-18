import { html, repeat } from "../packages.js";

const flag = ({ state, setState, field }) => {
  const { name, label } = field;
  return html`
    <input
      type="checkbox"
      id=${name}
      name=${name}
      @change=${e => {
        setState({ [name]: e.target.checked });
      }}
      .checked=${state[name]}
    />
    <label for="${name}">
      ${label}
    </label>
  `;
};

const flags = ({ state, setState, flags }) => {
  return repeat(
    flags,
    ({ name }) => name,
    (field, index) =>
      html`
        ${flag({ state, setState, field })}
      `
  );
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
    ${flags({ state, setState, flags: [
      { name: "global", label: "Global" },
      { name: "ignoreCase", label: "Ignore Case" },
      { name: "multiline", label: "Multiline" },
    ] })}
    </section>
  `;
};
