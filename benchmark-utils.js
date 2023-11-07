const benchmark = require("benchmark");
const fs = require("fs");
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
      console.log("Fastest is " + fastest);

      out.push("");
      out.push(`| Name | ops/sec | MoE | Runs sampled |`);
      out.push(`| ---- | -------:| --- | ----------- |`);

      var bySpeed = this.filter("successful").sort(function (a, b) {
        a = a.stats;
        b = b.stats;
        return a.mean + a.moe > b.mean + b.moe ? -1 : 1;
      });

      let result;
      while ((result = bySpeed.pop())) {
        const name =
          result.name == fastest ? `__${result.name}__` : result.name;
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

  out.push(`## ${name}`);
  out.push(`\`\`\`javascript
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
  out.push(`> Benchmarks run on`);
  out.push(`> - Node.js ${process.version}`);
  out.push(`> - ${cpu.manufacturer} ${cpu.brand} CPU`);
  out.push(`> - ${f.format(new Date())}`);
  out.push("");

  for (const { name, args } of suites) {
    run(name, args);
  }

  fs.writeFileSync("BENCHMARK.md", out.join("\n"));
}

module.exports = { register, runAll };
