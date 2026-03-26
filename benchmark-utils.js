const benchmark = require("benchmark");
const fs = require("node:fs");
const si = require("systeminformation");

const out = [];
const instances = [];

function register(name, run) {
  instances.push({ name, run });
}

function formatValue(value) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return `\`${value}\``;
  }

  return JSON.stringify(value, null, 2);
}

function run(name, args) {
  console.log("\n==>", name);

  let bench = new benchmark.Suite()
    .on("cycle", (event) => console.log("-", String(event.target)))
    .on("complete", function () {

      const fastest = this.filter("fastest").map("name");
      console.log("Fastest is ", fastest);

      out.push("", `| Name | ops/sec | MoE | Runs sampled |`, `| ---- | -------:| --- | ----------- |`);

      const bySpeed = this.filter("successful").sort(function (a, b) {
        a = a.stats;
        b = b.stats;
        return a.mean + a.moe > b.mean + b.moe ? -1 : 1;
      });

      let result;
      while ((result = bySpeed.pop())) {
        const shortName = result.name;
        const name =
          fastest.includes(result.name) ? `**${shortName}**` : shortName;
        const opsPerSecond = result.hz.toLocaleString("en-US", {
          maximumFractionDigits: 0,
        });
        const relativeMarginOferror = `± ${result.stats.rme.toFixed(2)}%`;
        const sampleSize = result.stats.sample.length;

        out.push(
          `| ${name} | ${opsPerSecond} | ${relativeMarginOferror} | ${sampleSize} |`
        );
      }

      out.push("");
    });

  console.log("\n===> Output");
  instances.forEach((instance) => {
    console.log(`${instance.name}:`);
    console.log(instance.run.default(args[0], args[1], args[2]));
    bench.add(instance.name, () =>
      instance.run.default(args[0], args[1], args[2])
    );
  });

  out.push(`## ${name}`, `\`\`\`javascript
const input = [${args.map(formatValue).join(", ")}];

// Renders: \`${instances[0].run.default(args[0], args[1], args[2])}\`
\`\`\``);

  console.log("\n===> Benchmark");
  bench.run();
  console.log();
}

async function runAll(...suites) {
  const cpu = await si.cpu();

  const f = new Intl.DateTimeFormat('en-US', {
    dateStyle: "long"
  });
  out.push(`> Benchmarks run on`, `>`, `> - Node.js ${process.version}`, `> - ${cpu.manufacturer} ${cpu.brand} CPU`, `> - ${f.format(new Date())}`, "");

  for (const { name, args } of suites) {
    run(name, args);
  }

  const content = fs.readFileSync("README.md", {encoding: "utf-8"});

  const splitContent = content.split("> Benchmarks run on");

  fs.writeFileSync("README.md", splitContent[0] + out.join("\n"));
}

module.exports = { register, runAll };
