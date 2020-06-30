# Tiny Messageformat

A MessageFormat parsing and formatting library

## Features

- Small
- Fast (See benchmarks below)
- Zero Dependency
- Well tested
- Flexible; Bring your own formatters

### Small, fast and dependency free

This library was build with the objective of being the smallest and fastest Messageformat library without sacrificing on accuracy.

### Well tested

Small and fast is useless if the feature doesn't work, @onigoetz/messageformat is backed with extensive testing.

### Flexible

@onigoetz/messageformat doesn't make assumptions on the rest of your stack, 
if you already have number and date formatters or just want to use the standard `Intl` API, that's all possible.

More often than not, libraries already include their own formatters, making it more difficult to reduce the overall size of a webapp/website.

## When is this library interesting ?

If you have an environment where pre-compiling translations isn't possible,
this library is very interesting because of its small footprint and performant parsing.

## Benchmarks

## Inspiration

This library takes from other 