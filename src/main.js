import App from './App.svelte';
import PDFJSViewer from './PDFJSViewer.svelte';

import { router } from "./router.js";

console.log("main.js");

export let currentComponent = null;

let currentFile = null;

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
  currentFile = null;
}

function routeViewLocal() {
  console.log(`routeViewLocal, path: ${window.location}`);
  const urlParams = new URLSearchParams(window.location.search);
  let fileName = urlParams.get('file')
  //fileName = decodeURI(fileName);

  // work-around interaction between Navaid and pdfjs viewer
  // pdfjs viewer pushes state onto browser history
  // which runs the Navaid.run() and I don't know how to prevent this
  // maybe Navaid shouldn't work that way
  // to work around this we remember which file is currently
  // displayed and ignore redundant navigations
  if (currentFile == fileName) {
    return;
  }
  console.log("dispatch /viewlocal?file=", fileName);
  const opts = {
    target: document.body,
    props: {
      fileName: fileName,
    }
  }
  const comp = new PDFJSViewer(opts);
  currentFile = fileName;
  mount(comp);
}

router
  .on('/', routeSlash)
  .on('/viewlocal', routeViewLocal)

const uri = location.pathname + location.search + location.hash
console.log("listen for:", uri);
router.listen(uri);
