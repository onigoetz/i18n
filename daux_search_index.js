load_search_index({"pages":[{"title":"I18N","text":"#I18n #@onigoetz\/i18n A suite of packages to ease your translation needs. #Packages @onigoetz\/messageformat a MessageFormat parsing and rendering library @onigoetz\/make-plural a lighter fork of make-plural meant for browser usage @onigoetz\/intl-formatters default formatters if you don\u2019t already have formatters for dates and numbers, uses the standard Intl API #Features Small, Fast and no NPM dependencies TypeScript \u2764\ufe0f Fully tested Flexible; Use one package, or two, bring your own formatters, or use the embedded ones, use on Node.js, or in the browser. You choose ! ICU MessageFormat compatible CLDR compatible #Example import { parse, createRenderer } from \"@onigoetz\/messageformat\"; import { dateFormatter, numberFormatter, pluralGenerator } from \"@onigoetz\/intl-formatters\"; \/\/ Parse the MessageFormat to a renderable format const parsed = parse(\"{test, plural, offset:3 one{one test} other {# test} }\"); \/\/ Create a localized renderer const render = createRenderer( \"en\", (locale: T, type) =&gt; pluralGenerator(locale, { type }), (locale: T, options, value: number) =&gt; numberFormatter(locale, options)(value), (locale: T, options, value: Date) =&gt; dateFormatter(locale, options)(value) ); render(parsed, { test: 4 }); \/\/ =&gt; \"one test\" render(parsed, { test: 7 }); \/\/ =&gt; \"4 test\" #Who is the audience for this library ? This library is meant for applications starting with medium scale, where you might have multiple libraries and frameworks inside. Since these libraries don\u2019t make any assumption about your stack, you can integrate them in any kind of application. Most importantly, if you have an environment where pre-compiling translations isn\u2019t possible, for example because your translation build process is separate from your app build process or you have a modular application \/ microfrontend. This library is very interesting as a lightweight runtime because of its small footprint and performant parsing. #Inspiration This suite of packages certainly wouldn\u2019t exist without the previous work in the field. This package forked make-plural at version 4 to make it smaller. Took inspiration for the MessageFormat parser from @ffz\/icu-msgparser for its small size and @phensley\/messageformat for its parsing speed.","tags":"","url":"index.html"},{"title":"intl-formatters","text":"This package provides simple implementations for Messageformat using the Intl API. #Features Numbers and currencies: https:\/\/developer.mozilla.org\/fr\/docs\/Web\/JavaScript\/Reference\/Objets_globaux\/Intl\/NumberFormat Dates: https:\/\/developer.mozilla.org\/fr\/docs\/Web\/JavaScript\/Reference\/Objets_globaux\/Intl\/DateTimeFormat Relative Time: https:\/\/developer.mozilla.org\/fr\/docs\/Web\/JavaScript\/Reference\/Objets_globaux\/Intl\/RelativeTimeFormat Plurals: https:\/\/developer.mozilla.org\/fr\/docs\/Web\/JavaScript\/Reference\/Objets_globaux\/Intl\/PluralRules #How to use These formatters are best used in conjunction with @onigoetz\/messageformat. However they are fully Typed and you may use them for any other use. import { parse, createRenderer } from \"@onigoetz\/messageformat\"; import { dateFormatter, numberFormatter, pluralGenerator, } from \"@onigoetz\/intl-formatters\"; \/\/ Parse the MessageFormat to a renderable format const parsed = parse(\"{test, plural, offset:3 one{one test} other {# test} }\"); \/\/ Create a localized renderer const render = createRenderer( \"en\", (locale: T, type) =&gt; pluralGenerator(locale, { type }), (locale: T, options, value: number) =&gt; numberFormatter(locale, options)(value), (locale: T, options, value: Date) =&gt; dateFormatter(locale, options)(value) ); render(parsed, { test: 4 }); \/\/ =&gt; \"one test\" render(parsed, { test: 7 }); \/\/ =&gt; \"4 test\" #For NodeJS If you do some generation using NodeJS and wish to use locales other than en. I strongly suggest you look at the following page : https:\/\/nodejs.org\/api\/intl.html#intl_providing_icu_data_at_runtime This page explains how to make sure you have all the right locales loaded to make your formatting. #Browser Support #Intl Base API (Dates, Numbers, Currencies, Relative Time) #Plurals","tags":"","url":"Packages\/intl_formatters.html"},{"title":"make-plural","text":"This package is a fork of make-plural version 4. It provided a compiler for CLDR plurals, but it also contained a lot of methods to test them. I stripped the test methods and kept the conversion code to make it smaller. #Usage import makePlural from \"@onigoetz\/make-plural\"; \/\/ Original CLDR data const pluralRules = { \"plurals-type-cardinal\": { en: { \"pluralRule-count-one\": \"i = 1 and v = 0 @integer 1\", \"pluralRule-count-other\": \" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, \u2026 @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, \u2026\" } }, \"plurals-type-ordinal\": { en: { \"pluralRule-count-one\": \"n % 10 = 1 and n % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, \u2026\", \"pluralRule-count-two\": \"n % 10 = 2 and n % 100 != 12 @integer 2, 22, 32, 42, 52, 62, 72, 82, 102, 1002, \u2026\", \"pluralRule-count-few\": \"n % 10 = 3 and n % 100 != 13 @integer 3, 23, 33, 43, 53, 63, 73, 83, 103, 1003, \u2026\", \"pluralRule-count-other\": \" @integer 0, 4~18, 100, 1000, 10000, 100000, 1000000, \u2026\" } } }; const pluralGenerator = makePlural(pluralRules[\"plurals-type-ordinal\"][\"en\"]); console.log(pluralGenerator(3)) \/\/ =&gt; few #Size optimization The original CLDR data is quite verbose and if you can preprocess it, a lot of data can be removed. You can remove anything after @decimal or @integer and the other rule, you can go from : { \"plurals-type-cardinal\": { \"en\": { \"pluralRule-count-one\": \"i = 1 and v = 0 @integer 1\", \"pluralRule-count-other\": \" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, \u2026 @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, \u2026\" } }, \"plurals-type-ordinal\": { \"en\": { \"pluralRule-count-one\": \"n % 10 = 1 and n % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, \u2026\", \"pluralRule-count-two\": \"n % 10 = 2 and n % 100 != 12 @integer 2, 22, 32, 42, 52, 62, 72, 82, 102, 1002, \u2026\", \"pluralRule-count-few\": \"n % 10 = 3 and n % 100 != 13 @integer 3, 23, 33, 43, 53, 63, 73, 83, 103, 1003, \u2026\", \"pluralRule-count-other\": \" @integer 0, 4~18, 100, 1000, 10000, 100000, 1000000, \u2026\" } } } to : { \"plurals-type-cardinal\": { \"en\": { \"pluralRule-count-one\": \"i = 1 and v = 0\" } }, \"plurals-type-ordinal\": { \"en\": { \"pluralRule-count-one\": \"n % 10 = 1 and n % 100 != 11\", \"pluralRule-count-two\": \"n % 10 = 2 and n % 100 != 12\", \"pluralRule-count-few\": \"n % 10 = 3 and n % 100 != 13\" } } } #Efficient pluralGenerator If you need to create many plural generators, parsing the CLDR data many times isn\u2019t efficient. You can create a small factory function like this: const pluralRules = {}; \/\/ CLDR data const pluralMemory = {}; function pluralGenerator(locale, type) { const key = `${locale}-${type}`; if (!pluralMemory.hasOwnProperty(key)) { pluralMemory[key] = makePlural( pluralRules[`plurals-type-${type}`][locale] ); } return pluralMemory[key]; }","tags":"","url":"Packages\/make_plural.html"},{"title":"messageformat","text":"","tags":"","url":"Packages\/messageformat.html"},{"title":"Specification","text":"This is an overview of the specification of MessageFormat. It seems that each language has a different specification for how MessageFormat needs to be parsed and rendered. This page will try to make a recap of what I understand and how that translate in practical usage. The rest of this page is in progress message = messageText (argument messageText)* argument = noneArg | simpleArg | complexArg complexArg = choiceArg | pluralArg | selectArg | selectordinalArg noneArg = '{' argNameOrNumber '}' simpleArg = '{' argNameOrNumber ',' argType [',' argStyle] '}' choiceArg = '{' argNameOrNumber ',' &quot;choice&quot; ',' choiceStyle '}' pluralArg = '{' argNameOrNumber ',' &quot;plural&quot; ',' pluralStyle '}' selectArg = '{' argNameOrNumber ',' &quot;select&quot; ',' selectStyle '}' selectordinalArg = '{' argNameOrNumber ',' &quot;selectordinal&quot; ',' pluralStyle '}' choiceStyle: see ChoiceFormat pluralStyle: see PluralFormat selectStyle: see SelectFormat argNameOrNumber = argName | argNumber argName = [^[[:Pattern_Syntax:][:Pattern_White_Space:]]]+ argNumber = '0' | ('1'..'9' ('0'..'9')*) argType = &quot;number&quot; | &quot;date&quot; | &quot;time&quot; | &quot;spellout&quot; | &quot;ordinal&quot; | &quot;duration&quot; argStyle = &quot;short&quot; | &quot;medium&quot; | &quot;long&quot; | &quot;full&quot; | &quot;integer&quot; | &quot;currency&quot; | &quot;percent&quot; | argStyleText | &quot;::&quot; argSkeletonText messageText can contain quoted literal strings including syntax characters. A quoted literal string begins with an ASCII apostrophe and a syntax character (usually a {curly brace}) and continues until the next single apostrophe. A double ASCII apostrohpe inside or outside of a quoted string represents one literal apostrophe. Quotable syntax characters are the {curly braces} in all messageText parts, plus the '#' sign in a messageText immediately inside a pluralStyle, and the '|' symbol in a messageText immediately inside a choiceStyle. See also MessagePattern.ApostropheMode In argStyleText, every single ASCII apostrophe begins and ends quoted literal text, and unquoted {curly braces} must occur in matched pairs. https:\/\/unicode-org.github.io\/icu-docs\/apidoc\/released\/icu4j\/com\/ibm\/icu\/text\/MessageFormat.html https:\/\/github.com\/unicode-org\/icu\/blob\/2666d18e544271d0f756bf20ee251c2cb699e269\/icu4j\/main\/classes\/core\/src\/com\/ibm\/icu\/text\/MessagePattern.java https:\/\/github.com\/unicode-org\/icu\/blob\/2666d18e544271d0f756bf20ee251c2cb699e269\/icu4j\/main\/classes\/core\/src\/com\/ibm\/icu\/impl\/PatternProps.java","tags":"","url":"Specification.html"},{"title":"Benchmark messageformat","text":"#MessageFormat parse and render benchmark In this benchmark we\u2019ll look at two metrics : Library size and parsing\/rendering speed. Like any synthetic benchmark these should be taken with a pinch of salt. I tried to compare apples with apples as much as possible, but some libraries do a bit more and some others do a bit less. Feel free to make a PR to help make these comparisons as fair as possible. As a final word, I made this comparison purely for fun and to learn a thing or two about performance optimization. #Libraries size Sources can be found in src, measure taken on 25\/06\/2020 With latest available versions Npm Package Version Size Comment @onigoetz\/messageformat 0.1.0 13K @ffz\/icu-msgparser 2.0.0 13K @onigoetz\/messageformat (memoized) 0.1.0 14K format-message 6.2.4 28K Uses peg.js intl-messageformat 9.8.2 54K Uses peg.js @phensley\/messageformat 1.2.6 48K messageformat 2.3.0 103K Uses peg.js In the case of @ffz\/icu-msgparser. The source largely inspired @onigoetz\/messageformat and since it provided no renderer by default, I put an early version of @onigoetz\/messageformat\u2019s renderer. Special mention for @eo-locale\/core Which provides a very small package, however it provides no package that runs on Node.js 10 and crashes on our test strings. #Benchmark Since each application has different translation needs, I tried to make a somewhat representative representation of what translation strings look like. From the simple string to the complex nested plural in a select, there are four different tests. #String const message = `Hello, world!`; const variables = {}; \/\/ Renders : Hello, world! @onigoetz\/messageformat x 4,608,460 ops\/sec \u00b11.50% (92 runs sampled) @onigoetz\/messageformat (memoized) x 4,536,394 ops\/sec \u00b11.67% (85 runs sampled) @phensley\/messageformat x 4,529,047 ops\/sec \u00b10.72% (88 runs sampled) format-message-parse x 3,992,051 ops\/sec \u00b10.23% (96 runs sampled) @ffz\/icu-msgparser x 1,583,621 ops\/sec \u00b10.46% (95 runs sampled) intl-messageformat x 454,716 ops\/sec \u00b11.04% (85 runs sampled) messageformat x 185,259 ops\/sec \u00b10.36% (90 runs sampled) #Message with one variable const message = `Hello, {name}!`; const variables = { name: \"John\" }; \/\/ Renders : Hello, John! format-message-parse x 1,941,376 ops\/sec \u00b10.82% (95 runs sampled) @phensley\/messageformat x 1,872,103 ops\/sec \u00b10.49% (93 runs sampled) @onigoetz\/messageformat (memoized) x 1,462,301 ops\/sec \u00b10.86% (95 runs sampled) @onigoetz\/messageformat x 1,379,505 ops\/sec \u00b10.47% (95 runs sampled) @ffz\/icu-msgparser x 1,009,608 ops\/sec \u00b11.03% (95 runs sampled) intl-messageformat x 300,560 ops\/sec \u00b11.85% (83 runs sampled) messageformat x 163,636 ops\/sec \u00b11.40% (93 runs sampled) #Let\u2019s get more creative const message = `Yo, {firstName} {lastName} has {numBooks, number, integer} {numBooks, plural, one {book} other {books}}.`; const variables = { firstName: \"John\", lastName: \"Constantine\", numBooks: 5, }; \/\/ Renders: Yo, John Constantine has 5 books. @phensley\/messageformat x 339,274 ops\/sec \u00b10.54% (94 runs sampled) @ffz\/icu-msgparser x 27,082 ops\/sec \u00b11.78% (93 runs sampled) @onigoetz\/messageformat x 17,177 ops\/sec \u00b13.25% (87 runs sampled) format-message-parse x 16,956 ops\/sec \u00b12.98% (90 runs sampled) messageformat x 14,239 ops\/sec \u00b13.57% (88 runs sampled) intl-messageformat x 11,730 ops\/sec \u00b14.34% (86 runs sampled) @onigoetz\/messageformat (memoized) x 4,702 ops\/sec \u00b116.39% (29 runs sampled) #Overly complex message const message = ` {gender_of_host, select, female { {num_guests, plural, offset:1 =0 {{host} does not give a party.} =1 {{host} invites {guest} to her party.} =2 {{host} invites {guest} and one other person to her party.} other {{host} invites {guest} and # other people to her party.} } } male { {num_guests, plural, offset:1 =0 {{host} does not give a party.} =1 {{host} invites {guest} to his party.} =2 {{host} invites {guest} and one other person to his party.} other {{host} invites {guest} and # other people to his party.} } } other { {num_guests, plural, offset:1 =0 {{host} does not give a party.} =1 {{host} invites {guest} to their party.} =2 {{host} invites {guest} and one other person to their party.} other {{host} invites {guest} and # other people to their party.} } } } `; const variables = { gender_of_host: \"male\", num_guests: 3, host: \"Lucifer\", guest: \"John Constantine\", }; \/\/ Renders : Lucifer invites John Constantine and 2 other people to his party. @onigoetz\/messageformat (memoized) x 58,697 ops\/sec \u00b12.56% (90 runs sampled) @onigoetz\/messageformat x 33,817 ops\/sec \u00b10.80% (94 runs sampled) @phensley\/messageformat x 35,552 ops\/sec \u00b10.27% (98 runs sampled) @ffz\/icu-msgparser x 14,154 ops\/sec \u00b11.00% (96 runs sampled) format-message-parse x 7,711 ops\/sec \u00b14.12% (93 runs sampled) intl-messageformat x 7,040 ops\/sec \u00b14.26% (83 runs sampled) messageformat x 6,428 ops\/sec \u00b10.20% (97 runs sampled)","tags":"","url":"Benchmark_messageformat.html"},{"title":"Benchmark plural","text":"#plural benchmarks In this benchmark we\u2019ll look at two metrics : Library size and speed. When doing the other benchmark in this repository I saw that what was taking most of the time wasn\u2019t the parsing or rendering of messageformat but the different formatters and plurals generators. I was curious about how different they were. #Libraries size Sources can be found in src, measure taken on 25\/06\/2020 With latest available versions Npm Package Version Size Comment @onigoetz\/intl-formatters 0.1.0 0.5K Embeds the formatters in the runtime @onigoetz\/make-plural 0.1.0 3.5K Contains only the formatter for en in this example, have to be shipped separately. @phensley\/plurals 1.6.6 38K Contains all locales make-plural 7.3.0 18K Contains all locales Raw results (09\/05\/2023) - @phensley\/plurals x 5,595,292 ops\/sec \u00b10.35% (94 runs sampled) - make-plural x 3,734,005 ops\/sec \u00b10.70% (95 runs sampled) - @onigoetz\/make-plural(memo) x 3,157,963 ops\/sec \u00b13.35% (84 runs sampled) - @onigoetz\/intl x 925,852 ops\/sec \u00b10.58% (93 runs sampled) - @onigoetz\/make-plural x 28,969 ops\/sec \u00b11.05% (87 runs sampled) Fastest is @phensley\/plurals @onigoetz\/intl uses Intl.PluralRules that ships with most browsers and Node.js runtimes but as you can see it\u2019s much slower than other solutions. @phensley\/plurals and make-plural both ship a pre-compiled and pre-optimized set of rules for plurals If you can live with the slightly larger build size, both of these are solid options. @onigoetz\/make-plural and its memoized version @onigoetz\/make-plural(memo) are made for the cases when you need to pluralize text but don\u2019t know in advance in which languages you\u2019ll need to do. If Intl.PluralRules is available and performance isn\u2019t too much of a concern go with it, otherwise you can use @onigoetz\/make-plural","tags":"","url":"Benchmark_plural.html"}]});