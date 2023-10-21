import { test } from '@japa/runner';

import parse from "./parser.js";
import { MessageOpType, Token } from "./types.js";

test.group("parse()", () => {
  test("accepts strings", ({expect}) => {
    const msg = "This is a test.";
    expect(parse(msg)).toEqual([[MessageOpType.TEXT, msg]]);
  });

  test("coerces input to string", ({expect}) => {
    //eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(parse()).toEqual([[MessageOpType.TEXT, "undefined"]]);
    //eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(parse(null)).toEqual([[MessageOpType.TEXT, "null"]]);
    expect(parse(12.34)).toEqual([[MessageOpType.TEXT, "12.34"]]);
  });

  test("parses variables", ({expect}) => {
    expect(parse("This is a {test}.")).toEqual([
      [MessageOpType.TEXT, "This is a "],
      [MessageOpType.ARG, "test"],
      [MessageOpType.TEXT, "."],
    ] as Token[]);
  });

  test("parses vars with number", ({expect}) => {
    expect(parse("{test, number}")).toEqual([
      [MessageOpType.SIMPLE, "test", "number"],
    ] as Token[]);
  });

  // TODO :: integer, currency, percent
  test("parses vars with number and format", ({expect}) => {
    expect(parse("{ test,    number, percent }")).toEqual([
      [MessageOpType.SIMPLE, "test", "number", ["percent"]],
    ] as Token[]);
  });

  test("parses vars with date", ({expect}) => {
    expect(parse("{test, date}")).toEqual([
      [MessageOpType.SIMPLE, "test", "date"],
    ] as Token[]);
  });

  // TODO :: short, medium, long, full
  test("parses vars with date and format", ({expect}) => {
    expect(parse("{test, date, short}")).toEqual([
      [MessageOpType.SIMPLE, "test", "date", ["short"]],
    ] as Token[]);
  });

  test("parses vars with time", ({expect}) => {
    expect(parse("{test, time}")).toEqual([
      [MessageOpType.SIMPLE, "test", "time"],
    ] as Token[]);
  });

  // TODO :: short, medium, long, full
  test("parses vars with time and format", ({expect}) => {
    expect(parse("{test, time, short}")).toEqual([
      [MessageOpType.SIMPLE, "test", "time", ["short"]],
    ] as Token[]);
  });

  test("parses plural tags", ({expect}) => {
    expect(parse("{test, plural, one{one test} other {# test} }")).toEqual([
      [
        MessageOpType.PLURAL,
        "test",
        undefined,
        true,
        {
          one: 1,
          other: 3,
        },
        6,
      ],
      [MessageOpType.TEXT, "one test"],
      [MessageOpType.END],
      [MessageOpType.ARG, "test", undefined],
      [MessageOpType.TEXT, " test"],
      [MessageOpType.END],
    ] as Token[]);

    expect(
      parse(`{num_guests, plural, offset:1
			=0 {{host} does not give a party.}
			=1 {{host} invites {guest} to their party.}
			=2 {{host} invites {guest} and one other person to their party.}
			other {{host} invites {guest} and # other people to their party.}
	}`),
    ).toEqual([
      [
        MessageOpType.PLURAL,
        "num_guests",
        1,
        true,
        {
          "=0": 1,
          "=1": 4,
          "=2": 9,
          other: 14,
        },
        21,
      ],
      [MessageOpType.ARG, "host"],
      [MessageOpType.TEXT, " does not give a party."],
      [MessageOpType.END],
      // index 4
      [MessageOpType.ARG, "host"],
      [MessageOpType.TEXT, " invites "],
      [MessageOpType.ARG, "guest"],
      [MessageOpType.TEXT, " to their party."],
      [MessageOpType.END],
      // index 9
      [MessageOpType.ARG, "host"],
      [MessageOpType.TEXT, " invites "],
      [MessageOpType.ARG, "guest"],
      [MessageOpType.TEXT, " and one other person to their party."],
      [MessageOpType.END],
      // index 14
      [MessageOpType.ARG, "host"],
      [MessageOpType.TEXT, " invites "],
      [MessageOpType.ARG, "guest"],
      [MessageOpType.TEXT, " and "],
      [MessageOpType.ARG, "num_guests", 1],
      [MessageOpType.TEXT, " other people to their party."],
      [MessageOpType.END],
    ] as Token[]);
  });

  test("parses plural with offset", ({expect}) => {
    expect(
      parse("{test, plural, offset:3 one{one test} other {# test} }"),
    ).toEqual([
      [
        MessageOpType.PLURAL,
        "test",
        3,
        true,
        {
          one: 1,
          other: 3,
        },
        6,
      ],
      [MessageOpType.TEXT, "one test"],
      [MessageOpType.END],
      [MessageOpType.ARG, "test", 3],
      [MessageOpType.TEXT, " test"],
      [MessageOpType.END],
    ] as Token[]);
  });

  test("parses selectordinal", ({expect}) => {
    expect(
      parse("{test, selectordinal, one{one test} other {# test} }"),
    ).toEqual([
      [
        MessageOpType.PLURAL,
        "test",
        undefined,
        false,
        {
          one: 1,
          other: 3,
        },
        6,
      ],
      [MessageOpType.TEXT, "one test"],
      [MessageOpType.END],
      [MessageOpType.ARG, "test", undefined],
      [MessageOpType.TEXT, " test"],
      [MessageOpType.END],
    ] as Token[]);
  });

  test("parses select", ({expect}) => {
    expect(
      parse("{test, select, first {yes} second {false} other {maybe}}"),
    ).toEqual([
      [
        MessageOpType.SELECT,
        "test",
        {
          first: 1,
          second: 3,
          other: 5,
        },
        7,
      ],
      [MessageOpType.TEXT, "yes"],
      [MessageOpType.END],
      [MessageOpType.TEXT, "false"],
      [MessageOpType.END],
      [MessageOpType.TEXT, "maybe"],
      [MessageOpType.END],
    ] as Token[]);
  });

  test("escapes characters", ({expect}) => {
    expect(parse("{0} {1} {2}")).toEqual([
      [MessageOpType.ARG, "0"],
      [MessageOpType.TEXT, " "],
      [MessageOpType.ARG, "1"],
      [MessageOpType.TEXT, " "],
      [MessageOpType.ARG, "2"],
    ] as Token[]);
    expect(parse("{0} '{1}' {2}")).toEqual([
      [MessageOpType.ARG, "0"],
      [MessageOpType.TEXT, " {1} "],
      [MessageOpType.ARG, "2"],
    ] as Token[]);
    expect(parse("{0} ''{1}'' {2}")).toEqual([
      [MessageOpType.ARG, "0"],
      [MessageOpType.TEXT, " '"],
      [MessageOpType.ARG, "1"],
      [MessageOpType.TEXT, "' "],
      [MessageOpType.ARG, "2"],
    ] as Token[]);
    expect(parse("{0} '''{1}''' {2}")).toEqual([
      [MessageOpType.ARG, "0"],
      [MessageOpType.TEXT, " '{1}' "],
      [MessageOpType.ARG, "2"],
    ] as Token[]);
    expect(parse("{0} '{1} {2}")).toEqual([
      [MessageOpType.ARG, "0"],
      [MessageOpType.TEXT, " {1} {2}"],
    ] as Token[]);
    expect(parse("{0} ''{1} {2}")).toEqual([
      [MessageOpType.ARG, "0"],
      [MessageOpType.TEXT, " '"],
      [MessageOpType.ARG, "1"],
      [MessageOpType.TEXT, " "],
      [MessageOpType.ARG, "2"],
    ] as Token[]);
  });

  test("does not escape sometimes", ({expect}) => {
    expect(parse("So, '{Mike''s Test}' is real.")).toEqual([
      [MessageOpType.TEXT, "So, {Mike's Test} is real."],
    ] as Token[]);

    expect(parse("You've done it now, {name}.")).toEqual([
      [MessageOpType.TEXT, "You've done it now, "],
      [MessageOpType.ARG, "name"],
      [MessageOpType.TEXT, "."],
    ] as Token[]);
  });

  test("throws on empty variable", ({expect}) => {
    expect(() => parse("{}")).toThrow("expected placeholder id");
  });

  test("throws on extra closing brace", ({expect}) => {
    expect(() => parse("}")).toThrow("unexpected }");
  });

  test("throws on unclosed variable", ({expect}) => {
    expect(() => parse("{n")).toThrow("expected , or }");
  });

  test("throws on open brace in variable", ({expect}) => {
    expect(() => parse("{n{")).toThrow("expected , or }");
    expect(() => parse("{n,{")).toThrow("expected type");
    expect(() => parse("{n,n{")).toThrow("expected , or }");
    expect(() => parse("{n,n,{")).toThrow("expected format");
  });

  test("throws on missing type", ({expect}) => {
    expect(() => parse("{n,}")).toThrow("expected type");
  });

  test("throws on missing format", ({expect}) => {
    expect(() => parse("{n,n,}")).toThrow("expected format");
  });

  test("throws on missing sub-messages", ({expect}) => {
    expect(() => parse("{n,select}")).toThrow("expected sub-messages");
    expect(() => parse("{n,selectordinal}")).toThrow("expected sub-messages");
    expect(() => parse("{n,plural}")).toThrow("expected sub-messages");
  });

  test("throws on bad sub-messages", ({expect}) => {
    expect(() => parse("{n,select,this thing}")).toThrow("expected {");
    expect(() => parse("{n,select,this {thing")).toThrow("expected }");
  });

  test("throws on missing other sub-message", ({expect}) => {
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

  test("throws on missing sub-message selector", ({expect}) => {
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

  test("throws on missing offset number", ({expect}) => {
    expect(() => parse("{n,plural,offset: other{n}")).toThrow(
      "expected sub-message selector at position 10 but found o.",
    );
  });
});
