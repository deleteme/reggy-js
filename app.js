import { render } from "./packages.js";
import { getState, subscribe, dispatch } from "./store.js";
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

const handleStore = () => renderApp({ state: getState(), dispatch });

subscribe(handleStore);

const tick = () => new Promise(setTimeout);

const reapplyScrollTopAfterPaste = async () => {
  if (getState().didRecentlyPaste) {
    const preview = document.getElementById("preview-interior");
    const isScrollTopOff = () =>
      preview.scrollTop !== getState().testStringPanelScrollTop;
    if (isScrollTopOff()) {
      await tick();
      preview.scrollTop = getState().testStringPanelScrollTop;
      // sometimes it doesn't stick
      if (!isScrollTopOff()) {
        dispatch({ type: "PASTE", didRecentlyPaste: false }, false);
      } else {
        console.log("retrying to apply scroll after paste.");
      }
    }
  }
};

subscribe(reapplyScrollTopAfterPaste);
subscribe(() => {
  //console.log(getState());
});

handleStore();

measure();
