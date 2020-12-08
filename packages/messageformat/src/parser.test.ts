import parse from "./parser";
import { Token } from "./types";

describe("parse()", () => {
  it("accepts strings", () => {
    const msg = "This is a test.";
    expect(parse(msg)).toEqual({ t: "text", v: msg });
  });

  it("coerces input to string", () => {
    //eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(parse()).toEqual({ t: "text", v: "undefined" });
    //eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(parse(null)).toEqual({ t: "text", v: "null" });
    expect(parse(12.34)).toEqual({ t: "text", v: "12.34" });
  });

  it("parses variables", () => {
    expect(parse("This is a {test}.")).toEqual({
      t: "block",
      c: [
        { t: "text", v: "This is a " },
        { t: "arg", v: "test" },
        { t: "text", v: "." }
      ]
    } as Token);
  });

  it("parses vars with number", () => {
    expect(parse("{test, number}")).toEqual({
      v: "test",
      t: "number"
    } as Token);
  });

  // TODO :: integer, currency, percent
  it("parses vars with number and format", () => {
    expect(parse("{ test,    number, percent }")).toEqual({
      v: "test",
      t: "number",
      f: "percent"
    } as Token);
  });

  it("parses vars with date", () => {
    expect(parse("{test, date}")).toEqual({ v: "test", t: "date" } as Token);
  });

  // TODO :: short, medium, long, full
  it("parses vars with date and format", () => {
    expect(parse("{test, date, short}")).toEqual({
      v: "test",
      t: "date",
      f: "short"
    } as Token);
  });

  it("parses vars with time", () => {
    expect(parse("{test, time}")).toEqual({ v: "test", t: "time" } as Token);
  });

  // TODO :: short, medium, long, full
  it("parses vars with time and format", () => {
    expect(parse("{test, time, short}")).toEqual({
      v: "test",
      t: "time",
      f: "short"
    } as Token);
  });

  it("parses plural tags", () => {
    expect(parse("{test, plural, one{one test} other {# test} }")).toEqual({
      v: "test",
      t: "plural",
      s: {
        one: { t: "text", v: "one test" },
        other: {
          t: "block",
          c: [
            { t: "arg", v: "test" },
            { t: "text", v: " test" }
          ]
        }
      }
    } as Token);

    expect(
      parse(`{num_guests, plural, offset:1
			=0 {{host} does not give a party.}
			=1 {{host} invites {guest} to their party.}
			=2 {{host} invites {guest} and one other person to their party.}
			other {{host} invites {guest} and # other people to their party.}
	}`)
    ).toEqual({
      v: "num_guests",
      t: "plural",
      o: 1,
      s: {
        "=0": {
          t: "block",
          c: [
            { t: "arg", v: "host" },
            { t: "text", v: " does not give a party." }
          ]
        },
        "=1": {
          t: "block",
          c: [
            { t: "arg", v: "host" },
            { t: "text", v: " invites " },
            { t: "arg", v: "guest" },
            {
              t: "text",
              v: " to their party."
            }
          ]
        },
        "=2": {
          t: "block",
          c: [
            { t: "arg", v: "host" },
            { t: "text", v: " invites " },
            { t: "arg", v: "guest" },
            {
              t: "text",
              v: " and one other person to their party."
            }
          ]
        },
        other: {
          t: "block",
          c: [
            { t: "arg", v: "host" },
            { t: "text", v: " invites " },
            { t: "arg", v: "guest" },
            {
              t: "text",
              v: " and "
            },
            { t: "arg", v: "num_guests", o: 1 },
            { t: "text", v: " other people to their party." }
          ]
        }
      }
    } as Token);
  });

  it("parses plural with offset", () => {
    expect(
      parse("{test, plural, offset:3 one{one test} other {# test} }")
    ).toEqual({
      v: "test",
      t: "plural",
      o: 3,
      s: {
        one: { t: "text", v: "one test" },
        other: {
          t: "block",
          c: [
            { t: "arg", v: "test", o: 3 },
            { t: "text", v: " test" }
          ]
        }
      }
    } as Token);
  });

  it("parses selectordinal", () => {
    expect(
      parse("{test, selectordinal, one{one test} other {# test} }")
    ).toEqual({
      v: "test",
      t: "selectordinal",
      s: {
        one: { t: "text", v: "one test" },
        other: {
          t: "block",
          c: [
            { t: "arg", v: "test" },
            { t: "text", v: " test" }
          ]
        }
      }
    } as Token);
  });

  it("parses select", () => {
    expect(
      parse("{test, select, first {yes} second {false} other {maybe}}")
    ).toEqual({
      v: "test",
      t: "select",
      s: {
        first: { t: "text", v: "yes" },
        second: { t: "text", v: "false" },
        other: { t: "text", v: "maybe" }
      }
    } as Token);
  });

  it("escapes characters", () => {
    expect(parse("{0} {1} {2}")).toEqual({
      t: "block",
      c: [
        { t: "arg", v: "0" },
        { t: "text", v: " " },
        { t: "arg", v: "1" },
        { t: "text", v: " " },
        { t: "arg", v: "2" }
      ]
    } as Token);
    expect(parse("{0} '{1}' {2}")).toEqual({
      t: "block",
      c: [
        { t: "arg", v: "0" },
        { t: "text", v: " {1} " },
        { t: "arg", v: "2" }
      ]
    } as Token);
    expect(parse("{0} ''{1}'' {2}")).toEqual({
      t: "block",
      c: [
        { t: "arg", v: "0" },
        { t: "text", v: " '" },
        { t: "arg", v: "1" },
        { t: "text", v: "' " },
        { t: "arg", v: "2" }
      ]
    } as Token);
    expect(parse("{0} '''{1}''' {2}")).toEqual({
      t: "block",
      c: [
        { t: "arg", v: "0" },
        { t: "text", v: " '{1}' " },
        { t: "arg", v: "2" }
      ]
    } as Token);
    expect(parse("{0} '{1} {2}")).toEqual({
      t: "block",
      c: [
        { t: "arg", v: "0" },
        { t: "text", v: " {1} {2}" }
      ]
    } as Token);
    expect(parse("{0} ''{1} {2}")).toEqual({
      t: "block",
      c: [
        { t: "arg", v: "0" },
        { t: "text", v: " '" },
        { t: "arg", v: "1" },
        { t: "text", v: " " },
        { t: "arg", v: "2" }
      ]
    } as Token);
  });

  it("does not escape sometimes", () => {
    expect(parse("So, '{Mike''s Test}' is real.")).toEqual({
      t: "text",
      v: "So, {Mike's Test} is real."
    } as Token);

    expect(parse("You've done it now, {name}.")).toEqual({
      t: "block",
      c: [
        { t: "text", v: "You've done it now, " },
        { t: "arg", v: "name" },
        { t: "text", v: "." }
      ]
    } as Token);
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
      "expected other sub-message"
    );
    expect(() => parse("{n,selectordinal,=0 {test}}")).toThrow(
      "expected other sub-message"
    );
    expect(() => parse("{n,plural,=0 {test}}")).toThrow(
      "expected other sub-message"
    );
  });

  it("throws on missing sub-message selector", () => {
    expect(() => parse("{n,select,{n}")).toThrow(
      "expected sub-message selector"
    );
    expect(() => parse("{n,selectordinal,{n}")).toThrow(
      "expected sub-message selector"
    );
    expect(() => parse("{n,plural,{n}")).toThrow(
      "expected sub-message selector"
    );
  });

  it("throws on missing offset number", () => {
    expect(() => parse("{n,plural,offset: other{n}")).toThrow(
      "expected sub-message selector at position 10 but found o."
    );
  });
});
