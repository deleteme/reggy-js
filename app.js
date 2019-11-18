import { render } from "./packages.js";
import { getState, setState, subscribe } from "./store.js";
import { app } from "./templates/app.js";

const renderApp = ({ state, setState }) => {
  render(app({ state, setState }), document.getElementById("app"));
};

subscribe(renderApp);