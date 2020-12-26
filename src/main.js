import App from './App.svelte';
import ViewLocal from './ViewLocal.svelte';
import { len } from './utils.js';

export let currentComponent = null;

function unmount() {
  if (currentComponent) {
    currentComponent.$destroy();
    currentComponent = null;
  }
}

function mount(component) {
  unmount();
  currentComponent = component;
}

async function dispatchByRoute() {
  const loc = window.location.pathname;
  console.log("dispatchByRoute:", loc);

  const opts = {
    target: document.body,
  }

  if (loc == "/") {
    const comp = new App(opts);
    mount(comp);
    return;
  }

  if (loc.startsWith("/viewlocal/")) {
    const fileName = window.location.hash.slice(1);
    console.log("dispatch /viewlocal/, fileName:", fileName);
    const opts = {
      target: document.body,
      props: {
        fileName: fileName,
      }
    }
    const comp = new ViewLocal(opts);
    mount(comp);
    return;
  }

  console.log(`Unknown location '${loc}'`);
  goToURL("/");
}

function goToURL(uri, title = "", noPush = false) {
  console.log("goTOURL:", uri);
  title = title || "";
  unmount();
  const o = {
    id: uri,
    title: title,
  };
  if (!noPush) {
    window.history.pushState(o, title, uri);
  } else {
    window.location = uri;
    return;
  }
  dispatchByRoute();
}

window.dispatchByRoute = dispatchByRoute;
window.goToURL = goToURL;

window.onpopstate = function (event) {
  let title = "";
  const o = event.state; // first argument to pushState
  if (o && o.title) {
    title = o.title;
  }
  const noPush = true;
  goToURL(document.location, title, noPush);
};

// console.log(pdfjsLib);
// console.log(pdfjsViewer);
dispatchByRoute();
