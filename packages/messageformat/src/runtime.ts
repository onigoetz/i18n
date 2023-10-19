import { DateFormatterOptions } from "@onigoetz/i18n-types";
import { Token, SimpleToken, ValueToken, MessageOpType } from "./types";

type Variables = Record<string, any> | [];

const validDateOptions: ("short" | "full" | "long" | "medium")[] = [
  "short",
  "full",
  "long",
  "medium",
];
const validNumberOptions: ("decimal" | "percent")[] = ["decimal", "percent"];
function validOrFirst<T>(value: string[] | undefined, options: T[]): T {
  const firstParam: string | undefined = value && value[0];
  if (options.indexOf(firstParam as unknown as T) > -1) {
    return firstParam as unknown as T;
  }

  return options[0];
}

function get(variables: Variables, token: ValueToken): any {
  // We recieve either an object or an array, both can be accessible as an index
  // some keys won't be available, we can live with that.
  // eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
  // @ts-ignore
  return variables[token[1]];
}

function noop(): string {
  return "";
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
      { style: validOrFirst(token[3], validNumberOptions) },
      get(variables, token),
    );
  }

  function datetime(token: SimpleToken, variables: Variables) {
    const options: DateFormatterOptions = {};
    options[token[2] as "date" | "time" | "datetime"] = validOrFirst(
      token[3],
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

  // TODO :: allow to add custom formatters to "types"

  return (tokens: Token[], variables: Variables = {}): string => {
    let result = "";

    const stack: number[] = [];
    const length = tokens.length;
    let i = 0;
    while (i < length) {
      const token: Token = tokens[i];

      switch (token[0]) {
        case MessageOpType.TEXT:
          result += token[1];
          break;
        case MessageOpType.ARG:
          if (token[2]) {
            result += get(variables, token) - token[2];
          } else {
            result += get(variables, token);
          }
          break;
        case MessageOpType.SIMPLE:
          // Find the formatter or fallback to NOOP
          result += (types[token[2]] || noop)(token, variables);
          break;
        case MessageOpType.SELECT:
          stack.push(token[3]);
          i = token[2][get(variables, token)] || token[2].other;

          continue; // skip the end of the loop
        case MessageOpType.PLURAL: {
          stack.push(token[5]);
          const value = get(variables, token);

          const directJump = token[4][`=${value}`];

          if (directJump) {
            i = directJump;
            continue;
          }

          const pluralType = token[3] ? "cardinal" : "ordinal";
          const offset = token[2] || 0; // TODO :: should offset apply to direct jump ?

          // TODO :: initialize pluralGenerator only if specific number isn't present
          const pluralRules = pluralGenerator(localeHolder, pluralType);

          const pluralJump = token[4][pluralRules(value - offset)];

          if (pluralJump) {
            i = pluralJump;
          } else {
            i = token[4].other;
          }
        }
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
