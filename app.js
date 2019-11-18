import { render } from "./packages.js";
import { getState, setState, subscribe } from "./store.js";
import { app } from "./templates/app.js";

const renderApp = () => {
  const state = getState();
  render(app({ state, setState }), document.getElementById("app"));
};

renderApp();
subscribe(renderApp);