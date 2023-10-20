#!/usr/bin/env node
"use strict";

/*
This benchmark is a copy of the intl-messageformat-parser project.

While the example strings are the same, we do compare many different
libraries with it.

intl-messageformat-parser is copyright 2019 Oath Inc. and licensed under
the New BSD License. For more, please see the original source at:
https://github.com/formatjs/formatjs/tree/master/packages/intl-messageformat-parser
*/

const benchmark = require("benchmark/benchmark");

const complex_msg = [
  `
{gender_of_host, select,
	female {
		{num_guests, plural, offset:1
			=0 {{host} does not give a party.}
			=1 {{host} invites {guest} to her party.}
			=2 {{host} invites {guest} and one other person to her party.}
			other {{host} invites {guest} and # other people to her party.}
		}
	}
	male {
		{num_guests, plural, offset:1
			=0 {{host} does not give a party.}
			=1 {{host} invites {guest} to his party.}
			=2 {{host} invites {guest} and one other person to his party.}
			other {{host} invites {guest} and # other people to his party.}
		}
	}
	other {
		{num_guests, plural, offset:1
			=0 {{host} does not give a party.}
			=1 {{host} invites {guest} to their party.}
			=2 {{host} invites {guest} and one other person to their party.}
			other {{host} invites {guest} and # other people to their party.}
		}
	}
}
`,
  {
    gender_of_host: "male",
    num_guests: 3,
    host: "Lucifer",
    guest: "John Constantine"
  }
];

const normal_msg = [
  `Yo, {firstName} {lastName} has {numBooks, number, integer} {numBooks, plural, one {book} other {books}}.`,
  {
    firstName: "John",
    lastName: "Constantine",
    numBooks: 5
  }
];
const simple_msg = [`Hello, {name}!`, { name: "John" }];
const string_msg = [`Hello, world!`, {}];

const instances = [];

function register(name, run) {
  console.log("\n==>", name);
  console.log("Simple String:", run.default(string_msg[0], string_msg[1]));
  console.log("With one variable:", run.default(simple_msg[0], simple_msg[1]));
  console.log("With number formatting and plurals:", run.default(normal_msg[0], normal_msg[1]));
  console.log("With select and plurals:", run.default(complex_msg[0], complex_msg[1]));

  instances.push({ name, run });
}

function runAll(name, instances, string) {
  console.log("\n==>", name);

  let bench = new benchmark.Suite()
    .on("cycle", event => console.log("-", String(event.target)))
    .on("complete", function() {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    });

  instances.forEach(instance => {
    bench.add(instance.name, () => instance.run.default(string[0], string[1]));
  });

  bench.run();
}

register("@onigoetz/messageformat (memoized)", require("./dist/onigoetz-messageformat-memoized.js"));
register("@onigoetz/messageformat", require("./dist/onigoetz-messageformat.js"));
register("@onigoetz/messageformat (phensley/plurals)", require("./dist/onigoetz-messageformat-phensley-plurals.js"));
register("@phensley/messageformat", require("./dist/phensley-messageformat.js"));
register("@ffz/icu-msgparser", require("./dist/ffz-icu-msgparser.js"));
register("format-message-parse", require("./dist/format-message.js"));
register("intl-messageformat", require("./dist/intl-messageformat.js"));
register("@messageformat/core", require("./dist/messageformat.js"));

runAll("Simple String", instances, string_msg);
runAll("With one variable", instances, simple_msg);
runAll("With number formatting and plurals", instances, normal_msg);
runAll("With select and plurals", instances, complex_msg);
