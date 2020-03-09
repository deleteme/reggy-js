import { render } from "./packages.js";
import { getState, subscribe, dispatch } from "./store.js";
import { app } from "./templates/app.js";
import { measurePreviewArea } from "./detect-textarea-size.js";

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

const reapplyScrollTopAfterPublish = ({ getState, action }) => {
  if (action.type === 'PUBLISH') {
    const preview = document.getElementById("preview-interior");
    //const isScrollTopOff = preview.scrollTop !== getState().testStringPanelScrollTop;
    //if (isScrollTopOff) {
      //preview.scrollTop = getState().testStringPanelScrollTop;
    //}
    const LINE_HEIGHT = 26;
    const scrollTop = getState().testStringPanelScrollTop
    const indexOfFirstVisibleLine = Math.floor(scrollTop / LINE_HEIGHT);
    //console.log('indexOfFirstVisibleLine', indexOfFirstVisibleLine);
    preview.scrollTop = scrollTop - (indexOfFirstVisibleLine * LINE_HEIGHT);
    //console.log('preview.scrollTop', preview.scrollTop);
  }
};

subscribe(reapplyScrollTopAfterPublish);

const stop = subscribe((props) => {
  measurePreviewArea(props)
  stop();
});

subscribe(({ getState, action }) => {
  //console.log('action', action, 'state', getState());
});

handleStore();

measure();

window.addEventListener('resize', () => {
  console.log('resize. measuring.');
  measurePreviewArea({ getState, dispatch })
});
