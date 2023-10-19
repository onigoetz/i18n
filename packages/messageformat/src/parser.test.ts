import parse from "./parser";
import { Token, MessageOpType } from "./types";

describe("parse()", () => {
  it("accepts strings", () => {
    const msg = "This is a test.";
    expect(parse(msg)).toEqual([[MessageOpType.TEXT, msg]]);
  });

  it("coerces input to string", () => {
    //eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(parse()).toEqual([[MessageOpType.TEXT, "undefined"]]);
    //eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(parse(null)).toEqual([[MessageOpType.TEXT, "null"]]);
    expect(parse(12.34)).toEqual([[MessageOpType.TEXT, "12.34"]]);
  });

  it("parses variables", () => {
    expect(parse("This is a {test}.")).toEqual([
      [MessageOpType.TEXT, "This is a "],
      [MessageOpType.ARG, "test"],
      [MessageOpType.TEXT, "."],
    ] as Token[]);
  });

  it("parses vars with number", () => {
    expect(parse("{test, number}")).toEqual([
      [MessageOpType.SIMPLE, "test", "number"],
    ] as Token[]);
  });

  // TODO :: integer, currency, percent
  it("parses vars with number and format", () => {
    expect(parse("{ test,    number, percent }")).toEqual([
      [MessageOpType.SIMPLE, "test", "number", ["percent"]],
    ] as Token[]);
  });

  it("parses vars with date", () => {
    expect(parse("{test, date}")).toEqual([
      [MessageOpType.SIMPLE, "test", "date"],
    ] as Token[]);
  });

  // TODO :: short, medium, long, full
  it("parses vars with date and format", () => {
    expect(parse("{test, date, short}")).toEqual([
      [MessageOpType.SIMPLE, "test", "date", ["short"]],
    ] as Token[]);
  });

  it("parses vars with time", () => {
    expect(parse("{test, time}")).toEqual([
      [MessageOpType.SIMPLE, "test", "time"],
    ] as Token[]);
  });

  // TODO :: short, medium, long, full
  it("parses vars with time and format", () => {
    expect(parse("{test, time, short}")).toEqual([
      [MessageOpType.SIMPLE, "test", "time", ["short"]],
    ] as Token[]);
  });

  it("parses plural tags", () => {
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

  it("parses plural with offset", () => {
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

  it("parses selectordinal", () => {
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

  it("parses select", () => {
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

  it("escapes characters", () => {
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

  it("does not escape sometimes", () => {
    expect(parse("So, '{Mike''s Test}' is real.")).toEqual([
      [MessageOpType.TEXT, "So, {Mike's Test} is real."],
    ] as Token[]);

    expect(parse("You've done it now, {name}.")).toEqual([
      [MessageOpType.TEXT, "You've done it now, "],
      [MessageOpType.ARG, "name"],
      [MessageOpType.TEXT, "."],
    ] as Token[]);
  });

  it("throws on empty variable", () => {
    expect(() => parse("{}")).toThrow("expected placeholder id");
  });

  it("throws on extra closing brace", () => {
    expect(() => parse("}")).toThrow("unexpected }");
  });

  it("throws on unclosed variable", () => {
    expect(() => parse("{n")).toThrow("expected , or }");
  });

  it("throws on open brace in variable", () => {
    expect(() => parse("{n{")).toThrow("expected , or }");
    expect(() => parse("{n,{")).toThrow("expected type");
    expect(() => parse("{n,n{")).toThrow("expected , or }");
    expect(() => parse("{n,n,{")).toThrow("expected format");
  });

  it("throws on missing type", () => {
    expect(() => parse("{n,}")).toThrow("expected type");
  });

  it("throws on missing format", () => {
    expect(() => parse("{n,n,}")).toThrow("expected format");
  });

  it("throws on missing sub-messages", () => {
    expect(() => parse("{n,select}")).toThrow("expected sub-messages");
    expect(() => parse("{n,selectordinal}")).toThrow("expected sub-messages");
    expect(() => parse("{n,plural}")).toThrow("expected sub-messages");
  });

  it("throws on bad sub-messages", () => {
    expect(() => parse("{n,select,this thing}")).toThrow("expected {");
    expect(() => parse("{n,select,this {thing")).toThrow("expected }");
  });

  it("throws on missing other sub-message", () => {
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

  it("throws on missing sub-message selector", () => {
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

  it("throws on missing offset number", () => {
    expect(() => parse("{n,plural,offset: other{n}")).toThrow(
      "expected sub-message selector at position 10 but found o.",
    );
  });
});
