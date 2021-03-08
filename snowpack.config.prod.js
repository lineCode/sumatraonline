/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: "/",
    src: "/dist",
  },
  plugins: [
    '@snowpack/plugin-svelte'
  ],
  devOptions: {
    fallback: "index.html",
  },
  buildOptions: {
    clean: true,
  },
  optimize: {
    bundle: true,
    minify: true,
    target: "es2018",
  },
  alias: {
    "pdfjs-lib": "./src/pdfjs-lib.js",
    "pdfjs-web": "./src/pdfjs/web",
    "lightning-fs": "./src/lightning-fs.js",
  },
};
