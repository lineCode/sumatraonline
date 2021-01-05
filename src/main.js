import Home from './Home.svelte';
import PDFJSViewer from './PDFJSViewer.svelte';

import { router } from "./router.js";

console.log("main.js");

let currentComponent = null;
// TODO: this is a work around to not double-show home page
// on browser back we get the first rote to / (from the browser)
// and then when we unmount PDFJSViewer component, the viewer
// pushes a new browser history state with undefined url
// and that triggers second route
let currComponentName = "";

let currentFile = null;

function unmount() {
  if (currentComponent) {
    currentComponent.$destroy();
    currentComponent = null;
  }
}

function mount(component) {
  currentComponent = component;
}

function routeSlash() {
  console.log("routeSlash, currComponentName:", currComponentName);
  const opts = {
    target: document.body,
  };
  const compName = "home";
  if (currComponentName == compName) {
    console.log("skipping mount because same component");
    return;
  }
  currComponentName = compName;
  unmount();
  const comp = new Home(opts);
  mount(comp);
  currentFile = null;
}

function routeViewLocal() {
  console.log(`routeViewLocal, path: ${window.location} h, currComponentName: ${currComponentName}`);
  const urlParams = new URLSearchParams(window.location.search);
  let fileName = urlParams.get('file')
  //fileName = decodeURI(fileName);

  const compName = "viewlocal";
  if (currComponentName == compName) {
    console.log("skipping mount because same component");
    return;
  }
  currComponentName = compName;

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
  unmount();
  const comp = new PDFJSViewer(opts);
  mount(comp);
  currentFile = fileName;
}

router
  .on('/', routeSlash)
  .on('/viewlocal', routeViewLocal)

const uri = location.pathname + location.search + location.hash
console.log("listen for:", uri);
router.listen(uri);
