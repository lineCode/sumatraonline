import App from './App.svelte';
import ViewLocal from './ViewLocal.svelte';
import navaid from './Navaid.js';

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

export let router = navaid();

function routeSlash() {
  console.log("routeSlash");
  const opts = {
    target: document.body,
  };
  const comp = new App(opts);
  mount(comp);
}

function routeViewLocal() {
  console.log("routeViewLocal");
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
}

router
  .on('/', routeSlash)
  .on('/viewlocal/', routeViewLocal);
