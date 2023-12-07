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

const { register, runAll } = require("../../benchmark-utils.js");

//register("@eo-locale/core", require("./dist/eo-locale-core.js"));

// Flat with variants
register(
  "@onigoetz/messageformat (+ @onigoetz/intl-formatters) flat",
  require("./dist/onigoetz-messageformat-flat-intl.js")
);
register(
  "@onigoetz/messageformat (+ make-plural) flat",
  require("./dist/onigoetz-messageformat-flat-make.js")
);
register(
  "@onigoetz/messageformat (+ @phensley/plurals) flat",
  require("./dist/onigoetz-messageformat-flat-phensley-plurals.js")
);

// Initial with variants
register(
  "@onigoetz/messageformat (+ @onigoetz/intl-formatters) initial",
  require("./dist/onigoetz-messageformat-initial-intl.js")
);
register(
  "@onigoetz/messageformat (+ @onigoetz/make-plural) initial",
  require("./dist/onigoetz-messageformat-initial-oni-make.js")
);

register(
  "@onigoetz/messageformat (+ @onigoetz/intl-formatters)",
  require("./dist/onigoetz-messageformat-intl.js")
);
register(
  "@onigoetz/messageformat (+ @onigoetz/make-plural)",
  require("./dist/onigoetz-messageformat-make.js")
);
register(
  "@onigoetz/messageformat (+ @phensley/plurals)",
  require("./dist/onigoetz-messageformat-phensley-plurals.js")
);

// Tree
register(
  "@onigoetz/messageformat (+ @onigoetz/intl-formatters) tree",
  require("./dist/onigoetz-messageformat-tree-intl.js")
);

register(
  "@phensley/messageformat",
  require("./dist/phensley-messageformat.js")
);
register("@ffz/icu-msgparser (+ custom renderer)", require("./dist/ffz-icu-msgparser.js"));
register("format-message-parse", require("./dist/format-message.js"));
register("globalize", require("./dist/globalize.js"));
register("intl-messageformat", require("./dist/intl-messageformat.js"));
register("@messageformat/core", require("./dist/messageformat-core.js"));

runAll(
  { name: "Simple String", args: [`Hello, world!`, {}] },
  { name: "With one variable", args: [`Hello, {name}!`, { name: "John" }] },
  {
    name: "With plurals",
    args: [
      `Yo, {firstName} {lastName} has {numBooks} {numBooks, plural, one {book} other {books}}.`,
      {
        firstName: "John",
        lastName: "Constantine",
        numBooks: 5,
      },
    ],
  },
  {
    name: "With select and plurals",
    args: [
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
        guest: "John Constantine",
      },
    ],
  }
);
