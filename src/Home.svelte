<script>
  import { onMount } from "svelte";
  import { len } from "./utils.js";
  import { router } from "./router.js";

  import FS from "@isomorphic-git/lightning-fs";

  let isDraggedOver = false;
  // file object: type: "file" or "dir", mode, size, isFile(), isDirectory()
  let files = [];
  let isInitialized = false;

  const fs = new FS("files").promises;

  /**
   * @param {Event} e
   */
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  async function handleOnMount() {
    const dir = "/";
    const fileNames = await fs.readdir(dir);
    for (let fileName of fileNames) {
      const st = await fs.stat(dir + fileName);
      // TODO: handing of directories must be different
      if (st.isFile()) {
        st.name = fileName;
        files.push(st);
      }
      files = files;
    }
    function sortByNames(o1, o2) {
      if (o1.name > o2.name) {
        return 1;
      }
      if (o1.name == o2.name) {
        return 0;
      }
      return -1;
    }
    files.sort(sortByNames);
    isInitialized = true;
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

    // TODO: save all files locally
    //fileToShow.set(firstFile);
    const fileName = firstFile.name;
    const buffer = await firstFile.arrayBuffer();
    const view = new Uint8Array(buffer);

    await fs.writeFile("/" + fileName, view);
    console.log("Wrote file to storage:", fileName);
    const uri = "/viewlocal?file=" + encodeURIComponent(fileName);
    //location.pathname = uri;
    router.run(uri);
  }
</script>

<style>
  #dragarea {
    height: 80%;
    border: 1px dashed black;
  }
  #dragarea.hili {
    border: 2px dashed blue;
  }
  .logo {
    font-family:'Arial Black', Arial
  }
</style>

<div class="flex flex-row-reverse border-b border-gray-600 pb-4">
  <div class="logo flex font-bold text-4xl mr-8 mt-2">
    <div style="color: rgb(196, 64, 50)">S</div>
    <div style="color: RGB(227, 107, 35)">u</div>
    <div style="color: RGB(93, 160, 40)">m</div>
    <div style="color: RGB(69, 132, 190)">a</div>
    <div style="color: RGB(112, 115, 207)">t</div>
    <div style="color: RGB(112, 115, 207)">r</div>
    <div style="color: RGB(69, 132, 190)">a</div>
    <div style="color:RGB(93, 160, 40) ">P</div>
    <div style="color: RGB(227, 107, 35)">D</div>
    <div style="color: rgb(196, 64, 50)">F</div>
    <div>&nbsp;</div>  
    <div style="color: rgb(196, 64, 50)">O</div>
    <div style="color: RGB(227, 107, 35)">n</div>
    <div style="color: RGB(93, 160, 40)">l</div>
    <div style="color: RGB(69, 132, 190)">i</div>
    <div style="color: RGB(112, 115, 207)">n</div>
    <div style="color: RGB(93, 160, 40)">e</div>
  </div>
  
</div>

{#if isInitialized && len(files) == 0}
<!-- ondragover is vital in Chrome or else default handler will take over -->
<div
  id="dragarea"
  class="flex items-center justify-center my-0 mx-auto w-11/12 text-xl bg-gray-200"
  class:hili={isDraggedOver}
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave}
  on:drop|preventDefault|stopPropagation={handleDragDrop}
  ondragover="return false">
  <div>Drop PDF file to view.</div>
</div>
{/if}

{#if len(files) > 0}
  <div class="mt-4 table w-11/12 mx-auto">
    <div class="text-3xl mb-4">Local files:</div>
    {#each files as st}
      <div class="table-row">
        <a class="pt-2 table-cell w-4/12" href="/viewlocal?file={st.name}">{st.name}</a>
        <div class="table-cell ml-2">{st.size} bytes</div>
      </div>
    {/each}
  </div>
{/if}
