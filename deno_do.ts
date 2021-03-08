// console.log("Deno:", Deno);

async function waitProcess(p: any) {
    try {
        const s = await p.status();
        console.log("status:", s);
    } catch (ex) {
        console.log("Deno.run failed with:", ex);
        throw ex;
    }
}

async function build() {
    Deno.removeSync("build", { recursive: true});

    const p = Deno.run({
        cmd: ["cmd", "/C", "npm run build"],
    });
    waitProcess(p);
}

async function buildProd() {
    Deno.removeSync("build", { recursive: true});

    const p = Deno.run({
        cmd: ["cmd", "/C", "npm run buildprod"],
    });
    waitProcess(p);
}

async function run() {
    const p = Deno.run({
        cmd: ["cmd", "/C", "npm run start"],
    })
    waitProcess(p);
}

function usage() {
    console.log("Usage: doit.bat build | buildprod | run");
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
    default:
        console.log("Unknown cmd-line args:", Deno.args);
        usage();
}
