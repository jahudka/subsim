# Expression language

## Tokens

 - numeric literals (`-?(?=[\d.])(?:0|[1-9]\d*)?(?:\.\d*)?`)
 - identifiers (`[a-z$][a-z0-9_]*`)
 - operators (`[-+*/^]`)
 - parentheses (`[()]`)
 - comma
 - whitespace

## Expressions

 - function calls (`identifier` `(` [ `expression` [ `,` `expression` ]* ] `)`)
 - parenthesised expressions (`(` `expression` `)`)
 - unary operators (`operator` `expression`)
 - binary operators (`expression` `operator` `expression`)
 - identifiers and literals

## Operator precedence

```
"^" > "*", "/" > "+", "-"
```
