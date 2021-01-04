import App from './App.svelte';
import ViewLocal from './ViewLocal.svelte';
import PDFJSViewer from './PDFJSViewer.svelte';

import { router } from "./router.js";

console.log("main.js");

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
  const fileName = decodeURIComponent(window.location.hash.slice(1));
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

function routePDFJSViewer() {
    console.log("routePDFJSViewer");
    const fileName = decodeURIComponent(window.location.hash.slice(1));
    console.log("dispatch /pdfjsviewer/, fileName:", fileName);
    const opts = {
      target: document.body,
      props: {
        fileName: fileName,
      }
    }
    const comp = new PDFJSViewer(opts);
    mount(comp);
  }
  
router
  .on('/', routeSlash)
  .on('/viewlocal/', routeViewLocal)
  .on('/pdfjsviewer/', routePDFJSViewer);

router.listen();
