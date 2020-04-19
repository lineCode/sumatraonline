import App from './App.svelte';
import ViewDropped from './ViewDropped.svelte';

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

	if (loc == "/viewdroppedfile") {
		const comp = new ViewDropped(opts);
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
  window.goToURL(document.location, title, noPush);
};

// console.log(pdfjsLib);
// console.log(pdfjsViewer);
dispatchByRoute();
