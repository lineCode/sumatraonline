<script>
  import { fileToShow } from "./store.js";

  let dragAreaClass = "";

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDragEnter() {
    console.log("dragEnter");
    dragAreaClass = "hili";
  }

  function handleDragLeave() {
    console.log("dragLeave");
    dragAreaClass = "";
  }

  function handleDragDrop(e) {
    console.log("dragDrop");
    //preventDefaults(e);
    let dt = e.dataTransfer;
    let files = dt.files;
    //console.log("files:", files);
    const firstFile = files[0];
    console.log("firstFile:", firstFile);
    fileToShow.set(files[0]);
    window.goToURL("/viewdroppedfile")
  }
</script>

<style>
  #dragarea {
    width: 80%;
    margin: 0 auto;

    height: 80%;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 1px dashed black;
    background-color: #f2f2f2;
    font-size: 16pt;
  }
  #dragarea.hili {
    border: 2px dashed blue;
  }
</style>

<h1 class="text-center">Sumatra PDF Reader online</h1>
<!-- ondragover is vital in Chrome or else default handler will take over -->
<div
  id="dragarea"
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave}
  on:drop|preventDefault|stopPropagation={handleDragDrop}
  ondragover="return false"
  class={dragAreaClass}>
  <div>Drop PDF file to view.</div>
</div>
