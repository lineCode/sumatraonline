/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
      public: "/",
      src: "/dist",
    },
    plugins: [
      /* ... */
    '@snowpack/plugin-svelte'
    ],
    install: [
      /* ... */
    ],
    installOptions: {
      /* ... */
    },
    devOptions: {
      /* ... */
    },
    buildOptions: {
      clean: true,
    },
    proxy: {
      /* ... */
    },
    alias: {
      "pdfjs-lib": "./src/pdfjs-lib.js",
      "pdfjs-web": "./src/pdfjs/web",
    },
  };
  