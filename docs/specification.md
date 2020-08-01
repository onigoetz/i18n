
```
message = messageText (argument messageText)*
argument = noneArg | simpleArg | complexArg
complexArg = choiceArg | pluralArg | selectArg | selectordinalArg

noneArg = '{' argNameOrNumber '}'
simpleArg = '{' argNameOrNumber ',' argType [',' argStyle] '}'
choiceArg = '{' argNameOrNumber ',' "choice" ',' choiceStyle '}'
pluralArg = '{' argNameOrNumber ',' "plural" ',' pluralStyle '}'
selectArg = '{' argNameOrNumber ',' "select" ',' selectStyle '}'
selectordinalArg = '{' argNameOrNumber ',' "selectordinal" ',' pluralStyle '}'

choiceStyle: see ChoiceFormat
pluralStyle: see PluralFormat
selectStyle: see SelectFormat

argNameOrNumber = argName | argNumber
argName = [^[[:Pattern_Syntax:][:Pattern_White_Space:]]]+
argNumber = '0' | ('1'..'9' ('0'..'9')*)

argType = "number" | "date" | "time" | "spellout" | "ordinal" | "duration"
argStyle = "short" | "medium" | "long" | "full" | "integer" | "currency" | "percent" | argStyleText | "::" argSkeletonText
```


    messageText can contain quoted literal strings including syntax characters. A quoted literal string begins with an ASCII apostrophe and a syntax character (usually a {curly brace}) and continues until the next single apostrophe. A double ASCII apostrohpe inside or outside of a quoted string represents one literal apostrophe.
    Quotable syntax characters are the {curly braces} in all messageText parts, plus the '#' sign in a messageText immediately inside a pluralStyle, and the '|' symbol in a messageText immediately inside a choiceStyle.
    See also MessagePattern.ApostropheMode
    In argStyleText, every single ASCII apostrophe begins and ends quoted literal text, and unquoted {curly braces} must occur in matched pairs. 
    
    https://unicode-org.github.io/icu-docs/apidoc/released/icu4j/com/ibm/icu/text/MessageFormat.html
    https://github.com/unicode-org/icu/blob/2666d18e544271d0f756bf20ee251c2cb699e269/icu4j/main/classes/core/src/com/ibm/icu/text/MessagePattern.java
    https://github.com/unicode-org/icu/blob/2666d18e544271d0f756bf20ee251c2cb699e269/icu4j/main/classes/core/src/com/ibm/icu/impl/PatternProps.java