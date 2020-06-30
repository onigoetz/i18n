import {
  Token,
  TextToken,
  ArgToken,
  PluralToken,
  SelectOrdinalToken,
  SelectToken,
  SimpleToken,
  BlockToken
} from "./types";

export interface DateFormatterOptions {
  /**
   * One of the following String values: full, long, medium, or short, eg. { date: "full" }.
   */
  date?: "full" | "long" | "medium" | "short";
  /**
   * One of the following String values: full, long, medium, or short, eg. { time: "full" }.
   */
  time?: "full" | "long" | "medium" | "short";
  /**
   * One of the following String values: full, long, medium, or short, eg. { datetime: "full" }
   */
  datetime?: "full" | "long" | "medium" | "short";
}

type Variables = {} | [];

const validDateOptions = {
  full: "full",
  long: "long",
  medium: "medium",
  short: "short"
};

const validNumberTypes = {
  decimal: "decimal",
  percent: "percent"
};

export default function createRenderer<T>(
  localeHolder: T,
  pluralGenerator: (
    localeHolder: T,
    type: "cardinal" | "ordinal"
  ) => (number) => string,
  numberFormatter: (
    localeHolder: T,
    options: { style: string },
    value: number
  ) => string,
  dateFormatter: (
    localeHolder: T,
    options: DateFormatterOptions,
    value: Date
  ) => string
) {
  const formatters: {
    [key: string]: (token: Token, variables: Variables) => string;
  } = {
    text(token: TextToken, variables: Variables) {
      return token.v;
    },
    arg(token: ArgToken, variables: Variables) {
      if (token.f) {
        return variables[token.v] - token.f;
      }
      return variables[token.v];
    },
    number(token: SimpleToken, variables: Variables) {
      return numberFormatter(
        localeHolder,
        { style: validNumberTypes[token.f] || "decimal" },
        variables[token.v]
      );
    },
    datetime(token: SimpleToken, variables: Variables) {
      const options = {};
      options[token.t] = validDateOptions[token.f] || "short";

      return dateFormatter(localeHolder, options, variables[token.v]);
    },
    select(token: SelectToken, variables: Variables) {
      const value = variables[token.v];

      // eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/no-use-before-define
      return render(token.o[value] || token.o.other, variables);
    },
    plural(token: PluralToken | SelectOrdinalToken, variables: Variables) {
      const value = variables[token.v];
      const pluralType = token.t === "plural" ? "cardinal" : "ordinal";
      const offset = token.f || 0;
      const children = token.o;
      const pluralRules = pluralGenerator(localeHolder, pluralType);

      // eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/no-use-before-define
      return render(
        children[`=${value}`] ||
          children[pluralRules(value - offset)] ||
          children.other,
        variables
      );
    },
    block(token: BlockToken, variables: Variables) {
      let final = "";
      for (const i in token.n) {
        if (token.n.hasOwnProperty(i)) {
          // eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/no-use-before-define
          final += render(token.n[i], variables);
        }
      }

      return final;
    },
    custom(token: SimpleToken, variables: Variables) {
      // TODO :: do something with this block
      return "";
    },
    noop() {
      return "";
    }
  };

  // datetime, date and time all work the same
  formatters.time = formatters.date = formatters.datetime;

  // "selectordinal" works the same as plural, except with ordinal plurals instead of cardinal
  formatters.selectordinal = formatters.plural;

  function render(token: Token, variables?: Variables): string {
    return (formatters[token.t] || formatters.custom)(token, variables);
  }

  return render;
}
