import { DateFormatterOptions } from "@onigoetz/i18n-types";
import {
	Token,
	TextToken,
	ArgToken,
	PluralToken,
	SelectOrdinalToken,
	SelectToken,
	NumberToken,
	DateTimeToken,
	BlockToken,
	ValueToken,
} from "./types";

type Variables = Record<string, any> | [];

const validDateOptions: ("short" | "full" | "long" | "medium")[] = [
	"short",
	"full",
	"long",
	"medium",
];
const validNumberOptions: ("decimal" | "percent")[] = ["decimal", "percent"];
function validOrFirst<T>(value: string | undefined, options: T[]): T {
	if (options.indexOf(value as unknown as T) > -1) {
		return value as unknown as T;
	}

	return options[0];
}

function get(variables: Variables, token: ValueToken): any {
	// We recieve either an object or an array, both can be accessible as an index
	// some keys won't be available, we can live with that.
	// eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
	// @ts-ignore
	return variables[token.v];
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
): (token: Token, variables?: Variables) => string {
	const formatters: {
		[key: string]: (token: any, variables: Variables) => string;
	} = {
		text(token: TextToken, variables: Variables) {
			return token.v;
		},
		arg(token: ArgToken, variables: Variables) {
			if (token.o) {
				return get(variables, token) - token.o;
			}
			return get(variables, token);
		},
		number(token: NumberToken, variables: Variables) {
			return numberFormatter(
				localeHolder,
				{ style: validOrFirst(token.f, validNumberOptions) },
				get(variables, token),
			);
		},
		datetime(token: DateTimeToken, variables: Variables) {
			const options: DateFormatterOptions = {};
			options[token.t] = validOrFirst(token.f, validDateOptions);

			return dateFormatter(localeHolder, options, get(variables, token));
		},
		select(token: SelectToken, variables: Variables) {
			// eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/no-use-before-define
			return render(token.s[get(variables, token)] || token.s.other, variables);
		},
		plural(token: PluralToken | SelectOrdinalToken, variables: Variables) {
			const value = get(variables, token);
			const pluralType = token.t === "plural" ? "cardinal" : "ordinal";
			const offset = token.o || 0;
			const children = token.s;
			const pluralRules = pluralGenerator(localeHolder, pluralType);

			// eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/no-use-before-define
			return render(
				children[`=${value}`] ||
					children[pluralRules(value - offset)] ||
					children.other,
				variables,
			);
		},
		block(token: BlockToken, variables: Variables) {
			let final = "";
			for (const i in token.c) {
				if (token.c.hasOwnProperty(i)) {
					// eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/no-use-before-define
					final += render(token.c[i], variables);
				}
			}

			return final;
		},
		custom(token: Token, variables: Variables) {
			// TODO :: do something with this block
			return "";
		},
		noop() {
			return "";
		},
	};

	// datetime, date and time all work the same
	formatters.time = formatters.date = formatters.datetime;

	// "selectordinal" works the same as plural, except with ordinal plurals instead of cardinal
	formatters.selectordinal = formatters.plural;

	function render(token: Token, variables: Variables = {}): string {
		return (formatters[token.t] || formatters.custom)(token, variables);
	}

	return render;
}
