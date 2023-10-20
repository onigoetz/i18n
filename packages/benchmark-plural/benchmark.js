#!/usr/bin/env node
"use strict";

const benchmark = require("benchmark/benchmark");

const instances = [];

function register(name, run) {
  console.log("\n==>", name);

  instances.push({ name, run });

  console.log("Ordinal", run.default("ordinal", "en", 2));
}

function runAll(name, instances, string) {
  console.log("\n==>", name);

  let bench = new benchmark.Suite()
    .on("cycle", event => console.log("-", String(event.target)))
    .on("complete", function() {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    });

  instances.forEach(instance => {
    bench.add(instance.name, () => instance.run.default(string[0], string[1], string[2]));
  });

  bench.run();
}

register("@onigoetz/make-plural", require("./dist/onigoetz-make-plural.js"));
register("@onigoetz/make-plural(memo)", require("./dist/onigoetz-make-plural-memo.js"));
register("@onigoetz/intl", require("./dist/onigoetz-intl.js"));
register("@phensley/plurals", require("./dist/phensley-plurals.js"));
register("make-plural", require("./dist/make-plural.js"));

runAll("Benchmark", instances, ["ordinal", "en", 2]);
