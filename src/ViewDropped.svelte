<script>
  import { onMount, onDestroy } from "svelte";
  import { fileToShow } from "./store.js";

  const scalePageWidth = "page-width";

  let msg = "Loading a file...";
  let pdfDoc = null;
  let nPages = 0;
  let pdflib = window.pdfjsLib;
  let viewer = window.pdfjsViewer;
  let pdfViewer = null;
  let container = null;

  // settings for PDF viewer
  let page = 1;
  let rotate = 0;
  let scale = "page-width";
  let resize = false;
  let annotation = false;
  let text = true;

  let annotationLayer = undefined;
  let textLayer = undefined;
  if (annotation) {
    annotationLayer = new viewer.DefaultAnnotationLayerFactory();
  }
  if (text) {
    textLayer = new viewer.DefaultTextLayerFactory();
  }

  let pdfLinkService = new viewer.PDFLinkService();

  $: goToPage(page);
  $: drawScaled(scale);
  $: doRotate(rotate);

  function goToPage(newPage) {
    if (!pdfViewer) {
      return;
    }
    let pdfPage = pdfDoc.getPage(newPage);
    pdfViewer.setPdfPage(pdfPage);
    pdfViewer.draw();
    page = newPage;
  }

  function doRotate(newRotate) {
    if (!pdfViewer) {
      return;
    }
    pdfViewer.update(scale, newRotate);
    pdfViewer.draw();
    rotate = newRotate;
  }

  function calculateScale(width = -1, height = -1) {
    // // Reset scaling to 1 so that "this.pdfViewer.viewport.width" gives proper width;
    pdfViewer.update(1, rotate);
    if (width === -1 && height === -1) {
      width = container.offsetWidth;
    }
    return width / pdfViewer.viewport.width;
  }

  function drawScaled(newScale) {
    if (!pdfViewer) {
      return;
    }
    console.log(`drawScaled(${newScale})`);
    if (newScale === scalePageWidth) {
      newScale = calculateScale();
      pdfViewer.update(newScale, rotate);
      pdfViewer.draw();
    }
  }

  function resizeScale() {
    if (resize) {
      drawScaled(scalePageWidth);
    }
  }

  async function handleOnMount() {
    let file = $fileToShow;
    if (!file) {
      window.goToURL("/");
      return;
    }
    msg = `Loading ${file.name} file..`;
    const ab = await file.arrayBuffer();
    const params = {
      data: ab,
      verbosity: 0
    };

    try {
      pdfDoc = await pdflib.getDocument(params).promise;
      nPages = pdfDoc.numPages;
      msg = `Loaded a PDF file with ${nPages} pages`;
      let pdfPage = await pdfDoc.getPage(1);
      msg = null;
      pdfViewer = new viewer.PDFPageView({
        container: container,
        id: page,
        scale: 1,
        defaultViewport: pdfPage.getViewport({ scale: 1 }),
        // We can enable text/annotations layers, if needed
        textLayerFactory: textLayer,
        annotationLayerFactory: annotationLayer
      });
      // Associates the actual page with the view, and drawing it
      pdfViewer.setPdfPage(pdfPage);
      pdfLinkService.setViewer(pdfViewer);
      drawScaled(scale);
    } catch (err) {
      msg = `Failed loading a file ${file.name} with error '${err}'`;
      pdfDoc = null;
    }
  }
  onMount(handleOnMount);

  onDestroy(() => {
    // console.log("destroying editor:", editor);
    if (pdfViewer) {
      pdfViewer.destroy();
      pdfViewer = null;
    }
    pdfDoc = null;
    //document.removeEventListener("keydown", onKeyDown);
  });
</script>

<style>
  .msg {
    border: 1px solid #ccc;
    padding: 1em;
    background-color: #f4f4f4;
  }
  .viewer {
    background-color: #fafafa;
  }
  #viewerContainer {
    position: relative;
  }

</style>

{#if msg}
  <div class="msg">{msg}</div>
{/if}

<div id="viewerContainer" bind:this={container}>
    {#if pdfViewer}
        <div id="viewer" class="pdfViewer" />
    {/if}
</div>
