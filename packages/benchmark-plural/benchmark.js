#!/usr/bin/env node
"use strict";

const { register, runAll } = require("../../benchmark-utils.js");

register("@onigoetz/make-plural", require("./dist/onigoetz-make-plural.js"));
register("@onigoetz/make-plural(memo)", require("./dist/onigoetz-make-plural-memo.js"));
register("@onigoetz/intl", require("./dist/onigoetz-intl.js"));
register("@phensley/plurals", require("./dist/phensley-plurals.js"));
register("make-plural", require("./dist/make-plural.js"));

runAll(
  { name: "Ordinal", args: ["ordinal", "en", 2] }
);
