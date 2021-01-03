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
      /* ... */
    },
  };
  