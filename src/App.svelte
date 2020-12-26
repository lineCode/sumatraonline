<script>
  import { onMount } from "svelte";
  import { len } from "./utils.js";

  import FS from "https://cdn.skypack.dev/@isomorphic-git/lightning-fs";

  let isDraggedOver = false;
  let files = [];

  const fs = new FS("files").promises;

  /**
   * @param {Event} e
   */
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  async function handleOnMount() {
    files = await fs.readdir("/");
  }
  onMount(handleOnMount);

  function handleDragEnter() {
    console.log("dragEnter");
    isDraggedOver = true;
  }

  function handleDragLeave() {
    console.log("dragLeave");
    isDraggedOver = false;
  }

  /**
   * @param {DragEvent} e
   */
  async function handleDragDrop(e) {
    console.log("dragDrop");
    //preventDefaults(e);
    let dt = e.dataTransfer;
    let files = dt.files;
    //console.log("files:", files);
    const firstFile = files[0];
    console.log("firstFile:", firstFile);
    //fileToShow.set(firstFile);
    const fileName = firstFile.name;
    const buffer = await firstFile.arrayBuffer();
    const view = new Uint8Array(buffer);

    await fs.writeFile("/" + fileName, view);
    console.log("Wrote file to storage:", fileName);
    const uri = encodeURI("/viewlocal/#" + fileName);
    window.goToURL(uri);
  }
</script>

<style>
  #dragarea {
    height: 80%;

    border: 1px dashed black;
    background-color: #f2f2f2;
  }
  #dragarea.hili {
    border: 2px dashed blue;
  }
</style>

<h1 class="text-center">Sumatra PDF Reader online</h1>
<!-- ondragover is vital in Chrome or else default handler will take over -->
<div
  id="dragarea"
  class="flex items-center justify-center my-0 mx-auto w-11/12 text-xl"
  class:hili={isDraggedOver}
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave}
  on:drop|preventDefault|stopPropagation={handleDragDrop}
  ondragover="return false">
  <div>Drop PDF file to view.</div>
</div>

{#if len(files) > 0}
  <div>Local files:</div>
  <div class="flex flex-col">
    {#each files as fileName}
      <a href="/viewlocal/#{fileName}">{fileName}</a>
    {/each}
  </div>
{/if}
