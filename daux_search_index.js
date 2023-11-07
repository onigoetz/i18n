load_search_index({"pages":[{"title":"I18N","text":"#I18n #@onigoetz\/i18n A suite of packages to ease your translation needs. #Packages @onigoetz\/messageformat a MessageFormat parsing and rendering library @onigoetz\/make-plural a lighter fork of make-plural meant for browser usage @onigoetz\/intl-formatters default formatters if you don\u2019t already have formatters for dates and numbers, uses the standard Intl API #Features Small, Fast and no NPM dependencies TypeScript \u2764\ufe0f Fully tested Flexible; Use one package, or two, bring your own formatters, or use the embedded ones, use on Node.js, or in the browser. You choose ! ICU MessageFormat compatible CLDR compatible #Example import { parse, createRenderer } from \"@onigoetz\/messageformat\"; import { dateFormatter, numberFormatter, pluralGenerator } from \"@onigoetz\/intl-formatters\"; \/\/ Parse the MessageFormat to a renderable format const parsed = parse(\"{test, plural, offset:3 one{one test} other {# test} }\"); \/\/ Create a localized renderer const render = createRenderer( \"en\", (locale: T, type) =&gt; pluralGenerator(locale, { type }), (locale: T, options, value: number) =&gt; numberFormatter(locale, options)(value), (locale: T, options, value: Date) =&gt; dateFormatter(locale, options)(value) ); render(parsed, { test: 4 }); \/\/ =&gt; \"one test\" render(parsed, { test: 7 }); \/\/ =&gt; \"4 test\" #Who is the audience for this library ? This library is meant for applications starting with medium scale, where you might have multiple libraries and frameworks inside. Since these libraries don\u2019t make any assumption about your stack, you can integrate them in any kind of application. Most importantly, if you have an environment where pre-compiling translations isn\u2019t possible, for example because your translation build process is separate from your app build process or you have a modular application \/ microfrontend. This library is very interesting as a lightweight runtime because of its small footprint and performant parsing. #Inspiration This suite of packages certainly wouldn\u2019t exist without the previous work in the field. This package forked make-plural at version 4 to make it smaller. Took inspiration for the MessageFormat parser from @ffz\/icu-msgparser for its small size and @phensley\/messageformat for its parsing speed.","tags":"","url":"index.html"},{"title":"intl-formatters","text":"This package provides simple implementations for Messageformat using the Intl API. #Features Numbers and currencies: https:\/\/developer.mozilla.org\/fr\/docs\/Web\/JavaScript\/Reference\/Objets_globaux\/Intl\/NumberFormat Dates: https:\/\/developer.mozilla.org\/fr\/docs\/Web\/JavaScript\/Reference\/Objets_globaux\/Intl\/DateTimeFormat Relative Time: https:\/\/developer.mozilla.org\/fr\/docs\/Web\/JavaScript\/Reference\/Objets_globaux\/Intl\/RelativeTimeFormat Plurals: https:\/\/developer.mozilla.org\/fr\/docs\/Web\/JavaScript\/Reference\/Objets_globaux\/Intl\/PluralRules #How to use These formatters are best used in conjunction with @onigoetz\/messageformat. However they are fully Typed and you may use them for any other use. import { parse, createRenderer } from \"@onigoetz\/messageformat\"; import { dateFormatter, numberFormatter, pluralGenerator, } from \"@onigoetz\/intl-formatters\"; \/\/ Parse the MessageFormat to a renderable format const parsed = parse(\"{test, plural, offset:3 one{one test} other {# test} }\"); \/\/ Create a localized renderer const render = createRenderer( \"en\", (locale: T, type) =&gt; pluralGenerator(locale, { type }), (locale: T, options, value: number) =&gt; numberFormatter(locale, options)(value), (locale: T, options, value: Date) =&gt; dateFormatter(locale, options)(value) ); render(parsed, { test: 4 }); \/\/ =&gt; \"one test\" render(parsed, { test: 7 }); \/\/ =&gt; \"4 test\" #For NodeJS If you do some generation using NodeJS and wish to use locales other than en. I strongly suggest you look at the following page : https:\/\/nodejs.org\/api\/intl.html#intl_providing_icu_data_at_runtime This page explains how to make sure you have all the right locales loaded to make your formatting. #Browser Support #Intl Base API (Dates, Numbers, Currencies, Relative Time) #Plurals","tags":"","url":"Packages\/intl_formatters.html"},{"title":"make-plural","text":"This package is a fork of make-plural version 4. It provided a compiler for CLDR plurals, but it also contained a lot of methods to test them. I stripped the test methods and kept the conversion code to make it smaller. #Usage import makePlural from \"@onigoetz\/make-plural\"; \/\/ Original CLDR data const pluralRules = { \"plurals-type-cardinal\": { en: { \"pluralRule-count-one\": \"i = 1 and v = 0 @integer 1\", \"pluralRule-count-other\": \" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, \u2026 @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, \u2026\" } }, \"plurals-type-ordinal\": { en: { \"pluralRule-count-one\": \"n % 10 = 1 and n % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, \u2026\", \"pluralRule-count-two\": \"n % 10 = 2 and n % 100 != 12 @integer 2, 22, 32, 42, 52, 62, 72, 82, 102, 1002, \u2026\", \"pluralRule-count-few\": \"n % 10 = 3 and n % 100 != 13 @integer 3, 23, 33, 43, 53, 63, 73, 83, 103, 1003, \u2026\", \"pluralRule-count-other\": \" @integer 0, 4~18, 100, 1000, 10000, 100000, 1000000, \u2026\" } } }; const pluralGenerator = makePlural(pluralRules[\"plurals-type-ordinal\"][\"en\"]); console.log(pluralGenerator(3)) \/\/ =&gt; few #Size optimization The original CLDR data is quite verbose and if you can preprocess it, a lot of data can be removed. You can remove anything after @decimal or @integer and the other rule, you can go from : { \"plurals-type-cardinal\": { \"en\": { \"pluralRule-count-one\": \"i = 1 and v = 0 @integer 1\", \"pluralRule-count-other\": \" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, \u2026 @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, \u2026\" } }, \"plurals-type-ordinal\": { \"en\": { \"pluralRule-count-one\": \"n % 10 = 1 and n % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, \u2026\", \"pluralRule-count-two\": \"n % 10 = 2 and n % 100 != 12 @integer 2, 22, 32, 42, 52, 62, 72, 82, 102, 1002, \u2026\", \"pluralRule-count-few\": \"n % 10 = 3 and n % 100 != 13 @integer 3, 23, 33, 43, 53, 63, 73, 83, 103, 1003, \u2026\", \"pluralRule-count-other\": \" @integer 0, 4~18, 100, 1000, 10000, 100000, 1000000, \u2026\" } } } to : { \"plurals-type-cardinal\": { \"en\": { \"pluralRule-count-one\": \"i = 1 and v = 0\" } }, \"plurals-type-ordinal\": { \"en\": { \"pluralRule-count-one\": \"n % 10 = 1 and n % 100 != 11\", \"pluralRule-count-two\": \"n % 10 = 2 and n % 100 != 12\", \"pluralRule-count-few\": \"n % 10 = 3 and n % 100 != 13\" } } } #Efficient pluralGenerator If you need to create many plural generators, parsing the CLDR data many times isn\u2019t efficient. You can create a small factory function like this: const pluralRules = {}; \/\/ CLDR data const pluralMemory = {}; function pluralGenerator(locale, type) { const key = `${locale}-${type}`; if (!pluralMemory.hasOwnProperty(key)) { pluralMemory[key] = makePlural( pluralRules[`plurals-type-${type}`][locale] ); } return pluralMemory[key]; }","tags":"","url":"Packages\/make_plural.html"},{"title":"messageformat","text":"","tags":"","url":"Packages\/messageformat.html"},{"title":"Specification","text":"This is an overview of the specification of MessageFormat. It seems that each language has a different specification for how MessageFormat needs to be parsed and rendered. This page will try to make a recap of what I understand and how that translate in practical usage. The rest of this page is in progress message = messageText (argument messageText)* argument = noneArg | simpleArg | complexArg complexArg = choiceArg | pluralArg | selectArg | selectordinalArg noneArg = '{' argNameOrNumber '}' simpleArg = '{' argNameOrNumber ',' argType [',' argStyle] '}' choiceArg = '{' argNameOrNumber ',' &quot;choice&quot; ',' choiceStyle '}' pluralArg = '{' argNameOrNumber ',' &quot;plural&quot; ',' pluralStyle '}' selectArg = '{' argNameOrNumber ',' &quot;select&quot; ',' selectStyle '}' selectordinalArg = '{' argNameOrNumber ',' &quot;selectordinal&quot; ',' pluralStyle '}' choiceStyle: see ChoiceFormat pluralStyle: see PluralFormat selectStyle: see SelectFormat argNameOrNumber = argName | argNumber argName = [^[[:Pattern_Syntax:][:Pattern_White_Space:]]]+ argNumber = '0' | ('1'..'9' ('0'..'9')*) argType = &quot;number&quot; | &quot;date&quot; | &quot;time&quot; | &quot;spellout&quot; | &quot;ordinal&quot; | &quot;duration&quot; argStyle = &quot;short&quot; | &quot;medium&quot; | &quot;long&quot; | &quot;full&quot; | &quot;integer&quot; | &quot;currency&quot; | &quot;percent&quot; | argStyleText | &quot;::&quot; argSkeletonText messageText can contain quoted literal strings including syntax characters. A quoted literal string begins with an ASCII apostrophe and a syntax character (usually a {curly brace}) and continues until the next single apostrophe. A double ASCII apostrohpe inside or outside of a quoted string represents one literal apostrophe. Quotable syntax characters are the {curly braces} in all messageText parts, plus the '#' sign in a messageText immediately inside a pluralStyle, and the '|' symbol in a messageText immediately inside a choiceStyle. See also MessagePattern.ApostropheMode In argStyleText, every single ASCII apostrophe begins and ends quoted literal text, and unquoted {curly braces} must occur in matched pairs. https:\/\/unicode-org.github.io\/icu-docs\/apidoc\/released\/icu4j\/com\/ibm\/icu\/text\/MessageFormat.html https:\/\/github.com\/unicode-org\/icu\/blob\/2666d18e544271d0f756bf20ee251c2cb699e269\/icu4j\/main\/classes\/core\/src\/com\/ibm\/icu\/text\/MessagePattern.java https:\/\/github.com\/unicode-org\/icu\/blob\/2666d18e544271d0f756bf20ee251c2cb699e269\/icu4j\/main\/classes\/core\/src\/com\/ibm\/icu\/impl\/PatternProps.java","tags":"","url":"Specification.html"},{"title":"Benchmark messageformat","text":"#MessageFormat parse and render benchmark In this benchmark we\u2019ll look at two metrics : Library size and parsing\/rendering speed. Like any synthetic benchmark these should be taken with a pinch of salt. I tried to compare apples with apples as much as possible, but some libraries do a bit more and some others do a bit less. Feel free to make a PR to help make these comparisons as fair as possible. As a final word, I made this comparison purely for fun and to learn a thing or two about performance optimization. #Libraries size Sources can be found in src, measure taken on 07\/11\/2023 with latest available versions Npm Package Version Size Comment @ffz\/icu-msgparser (+ custom renderer) 2.0.0 13K @onigoetz\/messageformat (+ @onigoetz\/intl) 0.1.0 17K @onigoetz\/messageformat (+ @onigoetz\/make-plural) 0.1.0 20K format-message-parse 6.2.4 28K Uses peg.js @onigoetz\/messageformat (+ @phensley\/plurals) 0.1.0 62K intl-messageformat 10.5.4 71K Uses peg.js @phensley\/messageformat 1.7.3 81K @messageformat\/core 3.2.0 96K Uses peg.js Notes: @ffz\/icu-msgparser is only a parser, I added a renderer to it but did not add any number\/date formatter (hence the comparatively small size). @eo-locale\/core was excluded from this list as it crashes on our valid test strings. It would be a strong contender as it has a very small footprint (6.7KB). #Benchmark To make the benchmark compareable I tried to apply the same rules to all libraries. Each libraries must follow the same rules: Parse and format a string. Properly handles plurals. Do not perform any number or date formatting since not all libraries support them and it would give a serious boost to those. Give the same output as all other implementations. Compiled with the same tools and options. Use an identical method signature for all libraries. The benchmark is applied to 4 different strings, which for the simple cases should be fairly common in applications and more advanced case are probably not as common but should still be performant. Benchmarks run on Node.js v20.9.0 Apple M2 CPU November 7, 2023 #Simple String const input = [`Hello, world!`, {}]; \/\/ Renders: `Hello, world!` Name ops\/sec MoE Runs sampled @onigoetz\/messageformat (+ @onigoetz\/intl) 8,858,921 \u00b1 0.37% 96 @onigoetz\/messageformat (+ @phensley\/plurals) 8,771,570 \u00b1 0.27% 97 @onigoetz\/messageformat (+ @onigoetz\/make-plural) 7,731,610 \u00b1 0.26% 99 format-message-parse 7,755,763 \u00b1 0.71% 93 @ffz\/icu-msgparser (+ custom renderer) 5,634,717 \u00b1 0.83% 100 @phensley\/messageformat 5,411,679 \u00b1 0.09% 98 @messageformat\/core 1,201,810 \u00b1 0.13% 99 intl-messageformat 227,801 \u00b1 1.13% 90 #With one variable const input = [`Hello, {name}!`, { \"name\": \"John\" }]; \/\/ Renders: `Hello, John!` Name ops\/sec MoE Runs sampled @onigoetz\/messageformat (+ @phensley\/plurals) 4,235,594 \u00b1 0.11% 99 @onigoetz\/messageformat (+ @onigoetz\/intl) 4,218,973 \u00b1 0.18% 99 @onigoetz\/messageformat (+ @onigoetz\/make-plural) 4,050,269 \u00b1 0.13% 99 format-message-parse 3,483,847 \u00b1 0.15% 100 @ffz\/icu-msgparser (+ custom renderer) 3,310,961 \u00b1 3.14% 94 @phensley\/messageformat 2,753,537 \u00b1 0.27% 98 @messageformat\/core 697,507 \u00b1 0.17% 98 intl-messageformat 204,849 \u00b1 0.89% 96 #With plurals const input = [`Yo, {firstName} {lastName} has {numBooks} {numBooks, plural, one {book} other {books}}.`, { \"firstName\": \"John\", \"lastName\": \"Constantine\", \"numBooks\": 5 }]; \/\/ Renders: `Yo, John Constantine has 5 books.` Name ops\/sec MoE Runs sampled @onigoetz\/messageformat (+ @phensley\/plurals) 591,221 \u00b1 0.15% 100 @onigoetz\/messageformat (+ @onigoetz\/intl) 529,547 \u00b1 0.09% 98 @phensley\/messageformat 519,950 \u00b1 0.08% 97 @messageformat\/core 170,877 \u00b1 0.10% 95 @onigoetz\/messageformat (+ @onigoetz\/make-plural) 139,906 \u00b1 0.08% 98 @ffz\/icu-msgparser (+ custom renderer) 129,603 \u00b1 0.16% 100 format-message-parse 82,489 \u00b1 0.16% 97 intl-messageformat 47,011 \u00b1 1.86% 85 #With select and plurals const input = [` {gender_of_host, select, female { {num_guests, plural, offset:1 =0 {{host} does not give a party.} =1 {{host} invites {guest} to her party.} =2 {{host} invites {guest} and one other person to her party.} other {{host} invites {guest} and # other people to her party.} } } male { {num_guests, plural, offset:1 =0 {{host} does not give a party.} =1 {{host} invites {guest} to his party.} =2 {{host} invites {guest} and one other person to his party.} other {{host} invites {guest} and # other people to his party.} } } other { {num_guests, plural, offset:1 =0 {{host} does not give a party.} =1 {{host} invites {guest} to their party.} =2 {{host} invites {guest} and one other person to their party.} other {{host} invites {guest} and # other people to their party.} } } } `, { \"gender_of_host\": \"male\", \"num_guests\": 3, \"host\": \"Lucifer\", \"guest\": \"John Constantine\" }]; \/\/ Renders: ` Lucifer invites John Constantine and 2 other people to his party. ` Name ops\/sec MoE Runs sampled @onigoetz\/messageformat (+ @phensley\/plurals) 93,573 \u00b1 0.14% 97 @onigoetz\/messageformat (+ @onigoetz\/intl) 92,139 \u00b1 0.26% 97 @onigoetz\/messageformat (+ @onigoetz\/make-plural) 61,462 \u00b1 0.08% 98 @phensley\/messageformat 52,596 \u00b1 0.07% 101 @messageformat\/core 30,348 \u00b1 0.07% 99 @ffz\/icu-msgparser (+ custom renderer) 29,229 \u00b1 1.05% 99 format-message-parse 16,911 \u00b1 2.77% 96 intl-messageformat 16,581 \u00b1 1.08% 92","tags":"","url":"Benchmark_messageformat.html"},{"title":"Benchmark plural","text":"#plural benchmarks In this benchmark we\u2019ll look at two metrics : Library size and speed. When doing the other benchmark in this repository I saw that what was taking most of the time wasn\u2019t the parsing or rendering of messageformat but the different formatters and plurals generators. I was curious about how different they were. #Libraries size Sources can be found in src, measure taken on 25\/06\/2020 With latest available versions Npm Package Version Size Comment @onigoetz\/intl-formatters 0.1.0 3.9K Embeds the formatters in the runtime @onigoetz\/make-plural 0.1.0 6.6K Contains only the formatter for en in this example, have to be shipped separately. make-plural 7.3.0 20K Contains all locales @phensley\/plurals 1.7.3 48K Contains all locales Benchmarks run on Node.js v20.9.0 Apple M2 CPU November 7, 2023 #Ordinal const input = [`ordinal`, `en`, 2]; \/\/ Renders: `two` Name ops\/sec MoE Runs sampled make-plural 14,310,209 \u00b1 0.71% 96 @phensley\/plurals 12,529,550 \u00b1 0.24% 102 @onigoetz\/make-plural(memo) 11,836,619 \u00b1 0.37% 101 @onigoetz\/intl 2,143,555 \u00b1 0.35% 98 @onigoetz\/make-plural 56,021 \u00b1 0.64% 95 #Choosing a library for your use case If you know which languages you need in advance: @phensley\/plurals and make-plural both ship a pre-compiled and pre-optimized set of rules for plurals. They\u2019re the fastest options and will be the smallest if your build system can perform Tree Shaking. If you do not know the languages in advance. And speed is a concern: @onigoetz\/make-plural and its memoized alternative @onigoetz\/make-plural(memo) should do the trick. you will need to ship the pluralization rules one way or another to the function. And speed is not a concern: @onigoetz\/intl uses Intl.PluralRules that ships with most browsers and Node.js runtimes but as you can see it\u2019s much slower than other solutions.","tags":"","url":"Benchmark_plural.html"}]});