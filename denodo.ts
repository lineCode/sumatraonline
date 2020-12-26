
//console.log("foo");
// console.log("Deno.run:", Deno.run);

Deno.removeSync("build", { recursive: true});

const p = Deno.run({
    cmd: ["cmd", "/C", "yarn build"],
    // cmd: ["cmd", "/C", "npm start snowbuild"],
});

try {
    const s = await p.status();
    console.log("status:", s);
} catch (ex) {
    //console.log("Deno.run failed with:", ex);
    console.log("Deno.run failed");
}
