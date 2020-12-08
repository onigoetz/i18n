import parse from "./parser";
import createRenderer from "./runtime";

function getRenderer<T extends string>(locale: T) {
  return createRenderer(
    locale,
    (locale: T, type) => {
      const plural = new Intl.PluralRules(locale, { type });
      return value => plural.select(value);
    },
    (locale: T, options, value: number) => {
      return `${value} (${options.style})`;
    },
    (locale: T, options, value: Date) => {
      return `${value.toJSON().replace(/\..*$/g, "")} (${options.date}/${
        options.time
      }/${options.datetime})`;
    }
  );
}

describe("parse()", () => {
  const date = new Date(Date.UTC(1989, 11, 24, 3, 52, 0, 0));

  const render = getRenderer("en");
  it("accepts strings", () => {
    expect(render(parse("This is a test."))).toEqual("This is a test.");
  });

  it("coerces input to string", () => {
    //eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(render(parse())).toEqual("undefined");
    //eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(render(parse(null))).toEqual("null");
    expect(render(parse(12.34))).toEqual("12.34");
  });

  it("parses variables", () => {
    expect(render(parse("This is a {test}."), { test: "Potato" })).toEqual(
      "This is a Potato."
    );
  });

  it("parses vars with number and format", () => {
    expect(render(parse("{test, number}"), { test: 24.5 })).toEqual(
      "24.5 (decimal)"
    );
    expect(
      render(parse("{ test,    number, percent }"), { test: 0.5 })
    ).toEqual("0.5 (percent)");
  });

  it("renders vars with date and format", () => {
    expect(render(parse("{test, date}"), { test: date })).toEqual(
      "1989-12-24T03:52:00 (short/undefined/undefined)"
    );
    expect(render(parse("{test, date, short}"), { test: date })).toEqual(
      "1989-12-24T03:52:00 (short/undefined/undefined)"
    );
    expect(render(parse("{test, date, long}"), { test: date })).toEqual(
      "1989-12-24T03:52:00 (long/undefined/undefined)"
    );
    expect(render(parse("{test, date, full}"), { test: date })).toEqual(
      "1989-12-24T03:52:00 (full/undefined/undefined)"
    );
    expect(
      render(parse("{test, date, invalid stuff}"), { test: date })
    ).toEqual("1989-12-24T03:52:00 (short/undefined/undefined)");
  });

  it("renders vars with time and format", () => {
    expect(render(parse("{test, time}"), { test: date })).toEqual(
      "1989-12-24T03:52:00 (undefined/short/undefined)"
    );
    expect(render(parse("{test, time, short}"), { test: date })).toEqual(
      "1989-12-24T03:52:00 (undefined/short/undefined)"
    );
    expect(render(parse("{test, time, medium}"), { test: date })).toEqual(
      "1989-12-24T03:52:00 (undefined/medium/undefined)"
    );
    expect(
      render(parse("{test, time, invalid stuff}"), { test: date })
    ).toEqual("1989-12-24T03:52:00 (undefined/short/undefined)");
  });

  it("parses plural tags", () => {
    const parsed = parse("{test, plural, one{one test} other {# test} }");
    expect(render(parsed, { test: 1 })).toEqual("one test");
    expect(render(parsed, { test: 4 })).toEqual("4 test");
  });

  it("parses plural with offset", () => {
    const parsed = parse(
      "{test, plural, offset:3 one{one test} other {# test} }"
    );
    expect(render(parsed, { test: 4 })).toEqual("one test");
    expect(render(parsed, { test: 7 })).toEqual("4 test");
  });

  it("parses selectordinal", () => {
    const parsed = parse(
      "{test, selectordinal, one{one test} other {# test} }"
    );
    expect(render(parsed, { test: 1 })).toEqual("one test");
    expect(render(parsed, { test: 6 })).toEqual("6 test");
  });

  it("parses select", () => {
    const parsed = parse(
      "{test, select, first {yes} second {false} other {maybe}}"
    );
    expect(render(parsed, { test: "first" })).toEqual("yes");
    expect(render(parsed, { test: "second" })).toEqual("false");
    expect(render(parsed, { test: "prout" })).toEqual("maybe");
  });

  it("escapes characters", () => {
    const vars = ["zero", "one", "two"];
    expect(render(parse("{0} {1} {2}"), vars)).toEqual("zero one two");
    expect(render(parse("{0} '{1}' {2}"), vars)).toEqual("zero {1} two");
    expect(render(parse("{0} ''{1}'' {2}"), vars)).toEqual("zero 'one' two");
    expect(render(parse("{0} '''{1}''' {2}"), vars)).toEqual("zero '{1}' two");
    expect(render(parse("{0} '{1} {2}"), vars)).toEqual("zero {1} {2}");
    expect(render(parse("{0} ''{1} {2}"), vars)).toEqual("zero 'one two");
  });

  it("does not escape sometimes", () => {
    expect(render(parse("So, '{Mike''s Test}' is real."), {})).toEqual(
      "So, {Mike's Test} is real."
    );

    expect(
      render(parse("You've done it now, {name}."), { name: "Mike" })
    ).toEqual("You've done it now, Mike.");
  });

  it("renders complex nested messages", () => {
    const message = `
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
`;

    const variables = {
      gender_of_host: "male",
      num_guests: 3,
      host: "Lucifer",
      guest: "John Constantine"
    };

    expect(render(parse(message), variables)).toEqual(
      "\n\n\t\tLucifer invites John Constantine and 2 other people to his party.\n\t\n"
    );
  });
});
