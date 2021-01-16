/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: "/",
    src: "/dist",
  },
  plugins: [
    '@snowpack/plugin-svelte',
  ],
  "optimize": {
    //"bundle": true,
    //"target": 'es2018'
  },
  packageOptions: {
    //external: ["pdfjs-lib", "pdfjs-web"],
    source: 'remote',
  },
  devOptions: {
    fallback: "index.html",
  },
  buildOptions: {
    clean: true,
  },
  alias: {
    "pdfjs-lib": "./src/pdfjs-lib.js",
    "pdfjs-web": "./src/pdfjs/web",
  },
};
