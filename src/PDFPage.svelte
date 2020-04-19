<script>
  import { onMount, onDestroy } from "svelte";

  let viewer = window.pdfjsViewer;

  let scalePageWidth = "page-width";
  // must have, object representing pdf document
  export let pdfDoc = null;

  // which page we are showing
  export let pageNo = -1;
  // rotation of the page
  export let rotate = 0;
  export let scale = scalePageWidth;
  export let withTextLayer = true;
  export let withAnnotationLayer = false;

  let container = null;

  // object representing PDF page
  let pdfPage = null;
  // PDFPageView object representing rendering of a page
  let pageView = null;

  let annotationLayer = undefined;
  let textLayer = undefined;
  if (withAnnotationLayer) {
    annotationLayer = new viewer.DefaultAnnotationLayerFactory();
  }
  if (withTextLayer) {
    textLayer = new viewer.DefaultTextLayerFactory();
  }


/*
  $: goToPage(page);
  $: drawScaled(scale);
  $: doRotate(rotate);
*/

/*
  function doRotate(newRotate) {
    if (!pdfViewer) {
      return;
    }
    pdfViewer.update(scale, newRotate);
    pdfViewer.draw();
    rotate = newRotate;
  }
*/

/*
  function resizeScale() {
    if (resize) {
      drawScaled(scalePageWidth);
    }
  }
*/

  function calculateScale(width = -1, height = -1) {
    // Reset scaling to 1 so that "pdfViewer.viewport.width" gives proper width;
    pageView.update(1, rotate);
    if (width === -1 && height === -1) {
      width = container.offsetWidth;
    }
    return width / pageView.viewport.width;
  }

  function drawScaled(newScale) {
    if (!pageView) {
      return;
    }
    //console.log(`drawScaled(${newScale})`);
    if (newScale === scalePageWidth) {
      newScale = calculateScale();
    }
    pageView.update(newScale, rotate);
    pageView.draw();
  }

  async function loadPage() {
    // container is the element for the viewer
    // each PDFPageView creates a div and appends it to container
    pdfPage = await pdfDoc.getPage(pageNo);
    let pdfLinkService = new viewer.PDFLinkService();
    pageView = new viewer.PDFPageView({
      container: container,
      id: pageNo,
      scale: 1,
      defaultViewport: pdfPage.getViewport({ scale: 1 }),
      // We can enable text/annotations layers, if needed
      textLayerFactory: textLayer,
      annotationLayerFactory: annotationLayer
    });
    // associates the actual page with the view, and drawing it
    pageView.setPdfPage(pdfPage);
    pdfLinkService.setViewer(pageView);
    drawScaled(scale);
  }

  async function handleOnMount() {
    try {
      await loadPage(pageNo);
    } catch (err) {
      console.log(`loadPage(${pageNo}) failed with '${err}'`);
      pdfDoc = null;
    }
  }
  onMount(handleOnMount);

  onDestroy(() => {
    // console.log("destroying pdf page:", editor);
    if (pageView) {
      pageView.destroy();
      pageView = null;
    }
    pdfPage = null;
  });
</script>

<div bind:this={container} />
