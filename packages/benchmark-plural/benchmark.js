#!/usr/bin/env node
"use strict";

const benchmark = require("benchmark/benchmark");

const instances = [];

function register(name, run) {
  console.log("\n==>", name);

  instances.push({ name, run });

  console.log("Ordinal", run("ordinal", "en", 2));
}

function runAll(name, instances, string) {
  console.log("\n==>", name);

  let bench = new benchmark.Suite()
    .on("cycle", event => console.log("-", String(event.target)))
    .on("complete", function() {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    });

  instances.forEach(instance => {
    bench.add(instance.name, () => instance.run(string[0], string[1], string[2]));
  });

  bench.run();
}

register("@onigoetz/make-plural", require("./dist/js/onigoetz-make-plural.min.js"));
register("@onigoetz/make-plural-memoized", require("./dist/js/onigoetz-make-plural-memoized.min.js"));
register("@phensley/plurals", require("./dist/js/phensley-plurals.min.js"));

runAll("Let's get more creative", instances, ["ordinal", "en", 2]);
