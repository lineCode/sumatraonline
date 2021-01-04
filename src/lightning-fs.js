// TODO: figure out how to make webpack ignore this syntax or make it
// work with await import();

/* webpackIgnore: true */
import FS from "https://cdn.skypack.dev/@isomorphic-git/lightning-fs";

//let FS = await import( /* webpackIgnore: true */ "https://cdn.skypack.dev/@isomorphic-git/lightning-fs");

export default FS;
