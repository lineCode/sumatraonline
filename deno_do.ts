// console.log("Deno:", Deno);
import { moveSync } from "https://deno.land/std/fs/mod.ts";

async function waitProcess(p: any) {
    try {
        const s = await p.status();
        console.log("status:", s);
    } catch (ex) {
        console.log("Deno.run failed with:", ex);
        throw ex;
    }
}

async function cmdRun(cmd: string[]) {
    console.log("running:", cmd);
    const p = Deno.run({
        cmd: cmd,
    })
    await waitProcess(p);
    console.log("finished:", cmd);
}

function removeDir(dir: string) {
    try {
        Deno.removeSync(dir, { recursive: true });
    } catch {
        // it throws when directory doesn't exist, which is stupid
    }
}
async function build() {
    removeDir("build");
    cmdRun(["cmd", "/C", "npm run build"]);
}

async function buildProd() {
    removeDir("build");
    await cmdRun(["cmd", "/C", "npm run buildprod"]);
}

async function run() {
    cmdRun(["cmd", "/C", "npm run start"]);
}

async function deploy_cf() {
    await cmdRun(["git", "clean", "-f", "-d"])
    await cmdRun(["git", "checkout", "deploy-cf"])
    await cmdRun(["git", "rebase", "master"])
    console.log("before npm run build");
    await cmdRun(["cmd", "/C", "npm run build"]);
    //Deno.removeSync("build", { recursive: true});
    console.log("after npm run build");
    removeDir("www");
    moveSync("build", "www");
    await cmdRun(["git", "add", "www"])
    await cmdRun(["git", "commit", "-am", `"deploy"`])
    await cmdRun(["git", "push", "--force"])
    await cmdRun(["git", "checkout", "master"])
}

function usage() {
    console.log(`Usage: doit.bat $cmd
  build
  buildprod
  run
  deploy-cf
`);
}

function len(o : any) {
    if (o && o.length) {
        return o.length;
    }
    return 0;
}

if (len(Deno.args) == 0) {
    usage();
    Deno.exit(1);
}

const arg = Deno.args[0];

switch (arg) {
    case "build":
        build();
        break;
    case "buildprod":
        buildProd();
        break;
    case "run":
        run();
        break;
    case "deploy-cf":
        deploy_cf();
        break;
    default:
        console.log("Unknown cmd-line args:", Deno.args);
        usage();
}
