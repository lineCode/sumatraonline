<script>
  import { fileToShow } from "./store.js";
  import FS from "https://cdn.skypack.dev/@isomorphic-git/lightning-fs";

  let isDraggedOver = false;

  const fs = new FS("files");

  /**
   * @param {Event} e
   */
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

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
  function handleDragDrop(e) {
    console.log("dragDrop");
    //preventDefaults(e);
    let dt = e.dataTransfer;
    let files = dt.files;
    //console.log("files:", files);
    const firstFile = files[0];
    console.log("firstFile:", firstFile);
    fileToShow.set(files[0]);
    window.goToURL("/viewdroppedfile");
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
