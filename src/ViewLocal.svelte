<script>
  import { onMount, onDestroy } from "svelte";
  import { router } from "./router.js";
  import PDFPage from "./PDFPage.svelte";
  import FS from "https://cdn.skypack.dev/@isomorphic-git/lightning-fs";
  import * as pdflib from "pdfjs-lib";
  export let fileName = "";

  const fs = new FS("files").promises;

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
    console.log("ViewLocal: handleOnMount: loading file", fileName);
    let file;
    try {
      file = await fs.readFile("/" + fileName);
    } catch (ex) {
      // do nothing
      console.log("ViewLocal: handleOnMount: fs.ReadFile() failed with", ex);
    }
    if (!file) {
      console.log("no file, going back to /");
      router.run("/");
      return;
    }
    console.log("no file, going back to /");
    const ab = file.buffer;
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
    console.log("destroying viewer");
    /*
    if (pdfViewer) {
      pdfViewer.destroy();
      pdfViewer = null;
    }
    */
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
