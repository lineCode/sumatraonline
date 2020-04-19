<script>
  import { onMount, onDestroy } from "svelte";
  import PDFPage from "./PDFPage.svelte";
  import { fileToShow } from "./store.js";

  let pdflib = window.pdfjsLib;
  let viewer = window.pdfjsViewer;

  const scaleAuto = "auto";
  const scalePageFit = "page-fit";
  const scalePageActual = "page-actual";
  const scalePageWidth = "page-width";
  const scalePageHeight = "page-height";

  let pdfDoc = null;
  let pageNumbers = [];
  let rotate = 0;
  let scale = scalePageWidth;
  let nPages = 0;
  let msg = "Loading a file...";

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
      const a = [];
      for (let i = 1; i <= nPages; i++) {
        a.push(i);
      }
      pageNumbers = a;
      //msg = `Loaded a PDF file with ${nPages} pages`;
      msg = null;
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
</style>

{#if msg}
  <div class="msg">{msg}</div>
{/if}

{#if nPages > 0}
  {#each pageNumbers as pageNo, _ (pageNo)}
    <PDFPage pdfDoc={pdfDoc} pageNo={pageNo} rotate={rotate} scale={scale}></PDFPage>
  {/each}
{/if}
