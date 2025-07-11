import type { DateFormatterOptions } from "@onigoetz/i18n-types";
import {
  MessageOpType,
  type PluralToken,
  type SimpleToken,
  type Token,
  type VariableToken,
} from "./types.js";

type Variables = Record<string, any> | [];

const validDateOptions: ("short" | "full" | "long" | "medium")[] = [
  "short",
  "full",
  "long",
  "medium",
];
const validNumberOptions: ("decimal" | "percent")[] = ["decimal", "percent"];
function validOrFirst<T>(value: string[] | undefined, options: T[]): T {
  const firstParam: string | undefined = value?.[0];
  if (options.indexOf(firstParam as unknown as T) > -1) {
    return firstParam as unknown as T;
  }

  return options[0];
}

function get(variables: Variables, token: VariableToken): any {
  // We recieve either an object or an array, both can be accessible as an index
  // some keys won't be available, we can live with that.
  // eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
  // @ts-ignore
  return variables[token.v];
}

function noop(): string {
  return "";
}

function handlePlural<T>(
  token: PluralToken,
  variables: Variables,
  pluralGenerator: (
    localeHolder: T,
    type: "cardinal" | "ordinal",
  ) => (number: number) => string,
  localeHolder: T,
) {
  const value = get(variables, token);

  const directJump = token.m[`=${value}`];

  if (directJump) {
    return directJump;
  }

  const pluralType = token.c ? "cardinal" : "ordinal";
  const offset = token.o ?? 0;

  const pluralRules = pluralGenerator(localeHolder, pluralType);

  const pluralJump = token.m[pluralRules(value - offset)];

  if (pluralJump) {
    return pluralJump;
  } else {
    return token.m.other;
  }
}

export default function createRenderer<T>(
  localeHolder: T,
  pluralGenerator: (
    localeHolder: T,
    type: "cardinal" | "ordinal",
  ) => (number: number) => string,
  numberFormatter: (
    localeHolder: T,
    options: { style: "decimal" | "percent" },
    value: number,
  ) => string,
  dateFormatter: (
    localeHolder: T,
    options: DateFormatterOptions,
    value: Date,
  ) => string,
): (token: Token[], variables?: Variables) => string {
  function number(token: SimpleToken, variables: Variables) {
    return numberFormatter(
      localeHolder,
      { style: validOrFirst(token.s, validNumberOptions) },
      get(variables, token),
    );
  }

  function datetime(token: SimpleToken, variables: Variables) {
    const options: DateFormatterOptions = {};
    options[token.f as "date" | "time" | "datetime"] = validOrFirst(
      token.s,
      validDateOptions,
    );

    return dateFormatter(localeHolder, options, get(variables, token));
  }

  const types: {
    [key: string]: (token: any, variables: Variables) => string;
  } = {
    // datetime, date and time all work the same
    time: datetime,
    date: datetime,
    datetime,
    number,
  };

  return (tokens: Token[], variables: Variables = {}): string => {
    let result = "";

    const stack: number[] = [];
    const length = tokens.length;
    let i = 0;
    while (i < length) {
      const token: Token = tokens[i];

      switch (token.t) {
        case MessageOpType.TEXT:
          result += token.v;
          break;
        case MessageOpType.ARG:
          if (token.o) {
            result += get(variables, token) - token.o;
          } else {
            result += get(variables, token);
          }
          break;
        case MessageOpType.SIMPLE:
          // Find the formatter or fallback to NOOP
          result += (types[token.f] || noop)(token, variables);
          break;

        case MessageOpType.SELECT:
          stack.push(token.j);
          i = token.m[get(variables, token)] || token.m.other;
          continue; // skip the end of the loop

        case MessageOpType.PLURAL:
          stack.push(token.j);
          i = handlePlural(token, variables, pluralGenerator, localeHolder);
          continue; // skip the end of the loop

        case MessageOpType.END:
          i = stack.pop() as number;
          continue; // skip the end of the loop
      }

      i++;
    }

    return result;
  };
}
