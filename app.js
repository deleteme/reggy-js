import { render } from "./packages.js";
import { getState, setState as _setState } from "./store.js";
import { app } from "./templates/app.js";

const renderApp = () => {
  const state = getState();
  render(app({ state, setState }), document.getElementById("app"));
};

const setState = newState => {
  _setState(newState);
  requestAnimationFrame(renderApp);
};

renderApp();
