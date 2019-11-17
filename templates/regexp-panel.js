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
      .checked=${state.global}
    />
    <label for="${name}">
      ${label}
    </label>
  `;
};

const flags = ({ state, setState }) => {
  return repeat([{ name: 'global', label: 'Global' }], ({name}) => {
    return name;
  }, (field, index) => {
    return html`${flag({})}`;
  });
}

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
