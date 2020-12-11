#!/usr/bin/env node
"use strict";

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
  console.log("String:", run(string_msg[0], string_msg[1]));
  console.log("Message with one variable:", run(simple_msg[0], simple_msg[1]));
  console.log("Let's get more creative:", run(normal_msg[0], normal_msg[1]));
  console.log("Overly complex message:", run(complex_msg[0], complex_msg[1]));

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
    bench.add(instance.name, () => instance.run(string[0], string[1]));
  });

  bench.run();
}

register("@onigoetz/messageformat (memoized)", require("./dist/js/onigoetz-messageformat-memoized.min.js"));
register("@onigoetz/messageformat", require("./dist/js/onigoetz-messageformat.min.js"));
register("@phensley/messageformat", require("./dist/js/phensley-messageformat.min.js"));
register("@ffz/icu-msgparser", require("./dist/js/ffz-icu-msgparser.min.js"));
register("format-message-parse", require("./dist/js/format-message.min.js"));
register("intl-messageformat", require("./dist/js/intl-messageformat.min.js"));
register("messageformat", require("./dist/js/messageformat.min.js"));

runAll("String", instances, string_msg);
runAll("Message with one variable", instances, simple_msg);
runAll("Let's get more creative", instances, normal_msg);
runAll("Overly complex message", instances, complex_msg);
