import { render } from "./packages.js";
import { store } from "./store.js";
import { app } from "./templates/app.js";

const add = (a, b) => a + b;

const sum = values => {
  return values.reduce(add, 0);
};

const average = values => {
  const total = sum(values);
  return Math.round(total / values.length);
};

const measure = () => {
  const end = Date.now();
  const duration = end - window.start;
  const durations = JSON.parse(localStorage.getItem("durations")) || [];
  durations.push(duration);
  console.log(
    "durations.length",
    durations.length,
    "average",
    average(durations)
  );
  console.log("durations", durations);
  localStorage.setItem("durations", JSON.stringify(durations));
};

const renderApp = ({ state, dispatch }) => {
  render(app({ state, dispatch }), document.getElementById("app"));
};

const handleStore = () =>
  renderApp({ state: store.getState(), dispatch: store.dispatch });

store.subscribe(handleStore);

handleStore();

measure();
