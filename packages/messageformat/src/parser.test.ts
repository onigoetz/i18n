import { test } from "@japa/runner";

import parse from "./parser.js";
import { MessageOpType, Token } from "./types.js";

test.group("parse()", () => {
  test("accepts strings", ({ expect }) => {
    const msg = "This is a test.";
    expect(parse(msg)).toEqual([{ t: MessageOpType.TEXT, c: msg }]);
  });

  test("coerces input to string", ({ expect }) => {
    //eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(parse()).toEqual([{ t: MessageOpType.TEXT, c: "undefined" }]);
    //eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(parse(null)).toEqual([{ t: MessageOpType.TEXT, c: "null" }]);
    expect(parse(12.34)).toEqual([{ t: MessageOpType.TEXT, c: "12.34" }]);
  });

  test("parses variables", ({ expect }) => {
    expect(parse("This is a {test}.")).toEqual([
      { t: MessageOpType.TEXT, c: "This is a " },
      { t: MessageOpType.ARG, a: "test" },
      { t: MessageOpType.TEXT, c: "." },
    ] as Token[]);
  });

  test("parses vars with number", ({ expect }) => {
    expect(parse("{test, number}")).toEqual([
      { t: MessageOpType.SIMPLE, a: "test", f: "number" },
    ] as Token[]);
  });

  // TODO :: integer, currency, percent
  test("parses vars with number and format", ({ expect }) => {
    expect(parse("{ test,    number, percent }")).toEqual([
      { t: MessageOpType.SIMPLE, a: "test", f: "number", s: ["percent"] },
    ] as Token[]);
  });

  test("parses vars with date", ({ expect }) => {
    expect(parse("{test, date}")).toEqual([
      { t: MessageOpType.SIMPLE, a: "test", f: "date" },
    ] as Token[]);
  });

  // TODO :: short, medium, long, full
  test("parses vars with date and format", ({ expect }) => {
    expect(parse("{test, date, short}")).toEqual([
      { t: MessageOpType.SIMPLE, a: "test", f: "date", s: ["short"] },
    ] as Token[]);
  });

  test("parses vars with time", ({ expect }) => {
    expect(parse("{test, time}")).toEqual([
      { t: MessageOpType.SIMPLE, a: "test", f: "time" },
    ] as Token[]);
  });

  // TODO :: short, medium, long, full
  test("parses vars with time and format", ({ expect }) => {
    expect(parse("{test, time, short}")).toEqual([
      { t: MessageOpType.SIMPLE, a: "test", f: "time", s: ["short"] },
    ] as Token[]);
  });

  test("parses plural tags", ({ expect }) => {
    expect(parse("{test, plural, one{one test} other {# test} }")).toEqual([
      {
        t: MessageOpType.PLURAL,
        a: "test",
        o: undefined,
        c: true,
        m: {
          one: 1,
          other: 3,
        },
        j: 6,
      },
      { t: MessageOpType.TEXT, c: "one test" },
      { t: MessageOpType.END },
      { t: MessageOpType.ARG, a: "test", undefined },
      { t: MessageOpType.TEXT, c: " test" },
      { t: MessageOpType.END },
    ] as Token[]);

    expect(
      parse(`{num_guests, plural, offset:1
			=0 {{host} does not give a party.}
			=1 {{host} invites {guest} to their party.}
			=2 {{host} invites {guest} and one other person to their party.}
			other {{host} invites {guest} and # other people to their party.}
	}`),
    ).toEqual([
      {
        t: MessageOpType.PLURAL,
        a: "num_guests",
        o: 1,
        c: true,
        m: {
          "=0": 1,
          "=1": 4,
          "=2": 9,
          other: 14,
        },
        j: 21,
      },
      { t: MessageOpType.ARG, a: "host" },
      { t: MessageOpType.TEXT, c: " does not give a party." },
      { t: MessageOpType.END },
      // index 4
      { t: MessageOpType.ARG, a: "host" },
      { t: MessageOpType.TEXT, c: " invites " },
      { t: MessageOpType.ARG, a: "guest" },
      { t: MessageOpType.TEXT, c: " to their party." },
      { t: MessageOpType.END },
      // index 9
      { t: MessageOpType.ARG, a: "host" },
      { t: MessageOpType.TEXT, c: " invites " },
      { t: MessageOpType.ARG, a: "guest" },
      { t: MessageOpType.TEXT, c: " and one other person to their party." },
      { t: MessageOpType.END },
      // index 14
      { t: MessageOpType.ARG, a: "host" },
      { t: MessageOpType.TEXT, c: " invites " },
      { t: MessageOpType.ARG, a: "guest" },
      { t: MessageOpType.TEXT, c: " and " },
      { t: MessageOpType.ARG, a: "num_guests", o: 1 },
      { t: MessageOpType.TEXT, c: " other people to their party." },
      { t: MessageOpType.END },
    ] as Token[]);
  });

  test("parses plural with offset", ({ expect }) => {
    expect(
      parse("{test, plural, offset:3 one{one test} other {# test} }"),
    ).toEqual([
      {
        t: MessageOpType.PLURAL,
        a: "test",
        o: 3,
        c: true,
        m: {
          one: 1,
          other: 3,
        },
        j: 6,
      },
      { t: MessageOpType.TEXT, c: "one test" },
      { t: MessageOpType.END },
      { t: MessageOpType.ARG, a: "test", o: 3 },
      { t: MessageOpType.TEXT, c: " test" },
      { t: MessageOpType.END },
    ] as Token[]);
  });

  test("parses selectordinal", ({ expect }) => {
    expect(
      parse("{test, selectordinal, one{one test} other {# test} }"),
    ).toEqual([
      {
        t: MessageOpType.PLURAL,
        a: "test",
        o: undefined,
        c: false,
        m: {
          one: 1,
          other: 3,
        },
        j: 6,
      },
      { t: MessageOpType.TEXT, c: "one test" },
      { t: MessageOpType.END },
      { t: MessageOpType.ARG, a: "test", undefined },
      { t: MessageOpType.TEXT, c: " test" },
      { t: MessageOpType.END },
    ] as Token[]);
  });

  test("parses select", ({ expect }) => {
    expect(
      parse("{test, select, first {yes} second {false} other {maybe}}"),
    ).toEqual([
      {
        t: MessageOpType.SELECT,
        a: "test",
        m: {
          first: 1,
          second: 3,
          other: 5,
        },
        j: 7,
      },
      { t: MessageOpType.TEXT, c: "yes" },
      { t: MessageOpType.END },
      { t: MessageOpType.TEXT, c: "false" },
      { t: MessageOpType.END },
      { t: MessageOpType.TEXT, c: "maybe" },
      { t: MessageOpType.END },
    ] as Token[]);
  });

  test("escapes characters", ({ expect }) => {
    expect(parse("{0} {1} {2}")).toEqual([
      { t: MessageOpType.ARG, a: "0" },
      { t: MessageOpType.TEXT, c: " " },
      { t: MessageOpType.ARG, a: "1" },
      { t: MessageOpType.TEXT, c: " " },
      { t: MessageOpType.ARG, a: "2" },
    ] as Token[]);
    expect(parse("{0} '{1}' {2}")).toEqual([
      { t: MessageOpType.ARG, a: "0" },
      { t: MessageOpType.TEXT, c: " {1} " },
      { t: MessageOpType.ARG, a: "2" },
    ] as Token[]);
    expect(parse("{0} ''{1}'' {2}")).toEqual([
      { t: MessageOpType.ARG, a: "0" },
      { t: MessageOpType.TEXT, c: " '" },
      { t: MessageOpType.ARG, a: "1" },
      { t: MessageOpType.TEXT, c: "' " },
      { t: MessageOpType.ARG, a: "2" },
    ] as Token[]);
    expect(parse("{0} '''{1}''' {2}")).toEqual([
      { t: MessageOpType.ARG, a: "0" },
      { t: MessageOpType.TEXT, c: " '{1}' " },
      { t: MessageOpType.ARG, a: "2" },
    ] as Token[]);
    expect(parse("{0} '{1} {2}")).toEqual([
      { t: MessageOpType.ARG, a: "0" },
      { t: MessageOpType.TEXT, c: " {1} {2}" },
    ] as Token[]);
    expect(parse("{0} ''{1} {2}")).toEqual([
      { t: MessageOpType.ARG, a: "0" },
      { t: MessageOpType.TEXT, c: " '" },
      { t: MessageOpType.ARG, a: "1" },
      { t: MessageOpType.TEXT, c: " " },
      { t: MessageOpType.ARG, a: "2" },
    ] as Token[]);
  });

  test("does not escape sometimes", ({ expect }) => {
    expect(parse("So, '{Mike''s Test}' is real.")).toEqual([
      { t: MessageOpType.TEXT, c: "So, {Mike's Test} is real." },
    ] as Token[]);

    expect(parse("You've done it now, {name}.")).toEqual([
      { t: MessageOpType.TEXT, c: "You've done it now, " },
      { t: MessageOpType.ARG, a: "name" },
      { t: MessageOpType.TEXT, c: "." },
    ] as Token[]);
  });

  test("throws on empty variable", ({ expect }) => {
    expect(() => parse("{}")).toThrow("expected placeholder id");
  });

  test("throws on extra closing brace", ({ expect }) => {
    expect(() => parse("}")).toThrow("unexpected }");
  });

  test("throws on unclosed variable", ({ expect }) => {
    expect(() => parse("{n")).toThrow("expected , or }");
  });

  test("throws on open brace in variable", ({ expect }) => {
    expect(() => parse("{n{")).toThrow("expected , or }");
    expect(() => parse("{n,{")).toThrow("expected type");
    expect(() => parse("{n,n{")).toThrow("expected , or }");
    expect(() => parse("{n,n,{")).toThrow("expected format");
  });

  test("throws on missing type", ({ expect }) => {
    expect(() => parse("{n,}")).toThrow("expected type");
  });

  test("throws on missing format", ({ expect }) => {
    expect(() => parse("{n,n,}")).toThrow("expected format");
  });

  test("throws on missing sub-messages", ({ expect }) => {
    expect(() => parse("{n,select}")).toThrow("expected sub-messages");
    expect(() => parse("{n,selectordinal}")).toThrow("expected sub-messages");
    expect(() => parse("{n,plural}")).toThrow("expected sub-messages");
  });

  test("throws on bad sub-messages", ({ expect }) => {
    expect(() => parse("{n,select,this thing}")).toThrow("expected {");
    expect(() => parse("{n,select,this {thing")).toThrow("expected }");
  });

  test("throws on missing other sub-message", ({ expect }) => {
    expect(() => parse("{n,select, named {test}}")).toThrow(
      "expected other sub-message",
    );
    expect(() => parse("{n,selectordinal,=0 {test}}")).toThrow(
      "expected other sub-message",
    );
    expect(() => parse("{n,plural,=0 {test}}")).toThrow(
      "expected other sub-message",
    );
  });

  test("throws on missing sub-message selector", ({ expect }) => {
    expect(() => parse("{n,select,{n}")).toThrow(
      "expected sub-message selector",
    );
    expect(() => parse("{n,selectordinal,{n}")).toThrow(
      "expected sub-message selector",
    );
    expect(() => parse("{n,plural,{n}")).toThrow(
      "expected sub-message selector",
    );
  });

  test("throws on missing offset number", ({ expect }) => {
    expect(() => parse("{n,plural,offset: other{n}")).toThrow(
      "expected sub-message selector at position 10 but found o.",
    );
  });
});
