import { DateFormatterOptions } from "@onigoetz/i18n-types";
import {
  Token,
  TextToken,
  ArgToken,
  PluralToken,
  SelectToken,
  SimpleToken,
  BlockToken,
  ValueToken,
  MessageOpType
} from "./types";

type Variables = Record<string, any> | [];

const validDateOptions: ("short" | "full" | "long" | "medium")[] = [
  "short",
  "full",
  "long",
  "medium"
];
const validNumberOptions: ("decimal" | "percent")[] = ["decimal", "percent"];
function validOrFirst<T>(value: string[] | undefined, options: T[]): T {
  const firstParam: string | undefined = value && value[0];
  if (options.indexOf((firstParam as unknown) as T) > -1) {
    return (firstParam as unknown) as T;
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

export default function createRenderer<T>(
  localeHolder: T,
  pluralGenerator: (
    localeHolder: T,
    type: "cardinal" | "ordinal"
  ) => (number: number) => string,
  numberFormatter: (
    localeHolder: T,
    options: { style: "decimal" | "percent" },
    value: number
  ) => string,
  dateFormatter: (
    localeHolder: T,
    options: DateFormatterOptions,
    value: Date
  ) => string
): (token: Token, variables?: Variables) => string {
  function number(token: SimpleToken, variables: Variables) {
    return numberFormatter(
      localeHolder,
      { style: validOrFirst(token[3], validNumberOptions) },
      get(variables, token)
    );
  }

  function datetime(token: SimpleToken, variables: Variables) {
    const options: DateFormatterOptions = {};
    options[token[2] as "date" | "time" | "datetime"] = validOrFirst(
      token[3],
      validDateOptions
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
    number
  };

  // TODO :: allow to add custom formatters to "types"

  const formatters: {
    [key: string]: (token: any, variables: Variables) => string;
  } = {
    [MessageOpType.TEXT](token: TextToken, variables: Variables) {
      return token[1];
    },
    [MessageOpType.ARG](token: ArgToken, variables: Variables) {
      if (token[2]) {
        return get(variables, token) - token[2];
      }
      return get(variables, token);
    },
    [MessageOpType.SIMPLE](token: SimpleToken, variables: Variables) {
      // Find the formatter or fallback to NOOP
      return (types[token[2]] || formatters[MessageOpType.NOOP])(token, variables);
    },
    [MessageOpType.SELECT](token: SelectToken, variables: Variables) {
      // eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/no-use-before-define
      return render(
        token[2][get(variables, token)] || token[2].other,
        variables
      );
    },
    [MessageOpType.PLURAL](token: PluralToken, variables: Variables) {
      const value = get(variables, token);
      const pluralType = token[3] ? "cardinal" : "ordinal";
      const offset = token[2] || 0;
      const children = token[4];
      const pluralRules = pluralGenerator(localeHolder, pluralType);

      // eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/no-use-before-define
      return render(
        children[`=${value}`] ||
          children[pluralRules(value - offset)] ||
          children.other,
        variables
      );
    },
    [MessageOpType.BLOCK](token: BlockToken, variables: Variables) {
      let final = "";
      for (const i in token[1]) {
        if (token[1].hasOwnProperty(i)) {
          // eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/no-use-before-define
          final += render(token[1][i], variables);
        }
      }

      return final;
    },
    [MessageOpType.NOOP]() {
      return "";
    }
  };

  function render(token: Token, variables: Variables = {}): string {
    return (formatters[token[0]] || formatters[MessageOpType.NOOP])(
      token,
      variables
    );
  }

  return render;
}
