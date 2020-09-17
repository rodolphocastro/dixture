# Dixture

Dixture helps you create random data for your tests, with zero external dependencies!

## 🚥 Current Status

**Master status** ![Build and Test](https://github.com/rodolphocastro/dixture/workflows/Build%20and%20Test/badge.svg?branch=master)

**Project status**: *Under development*

**Latest stable version**: *v0.2.1*

## 🏆 Acknowledgements

Dixture is *loosely* based on the great [AutoFixture](https://github.com/AutoFixture/AutoFixture) library that exists on the `.NET` environment.

I've used this library for so long for my Unit and Integration tests that I needed to, somehow, get some of its functionality when working on my `Deno`'s tests.

Thus I began working on this project.

## ⚡ Getting Started

Simply import us by `deno.land/x/` and use your favorite flavor of test data generation!

*As of v0.2.1* you can pick from two "flavors":

1. Functions that create and/or assign fields for your classes and instances
2. A Factory API that allows you to write down rules for your classes

```typescript
import {
  dixtureFns,
  RuleSet,
  DixtureFactory,
  InterfaceRuleSet,
} from "https://deno.land/x/dixture@v0.2.1/mod.ts";

class Person {
  name: string = "";
  age: number = 0;
  bankBalance: bigint = 1n;
  isAlive: boolean = true;
}

interface DateRange {
  startsAt: Date;
  endsAt: Date;
}

// 1. Creating our factory
const factory = new DixtureFactory(
  // 2. Writing in-line Rule Sets (blueprints) for our classes
  new RuleSet(
    Person, // 3. For each field we pick a resolution function
    {
      field: "name",
      resolve: dixtureFns.String,
    },
    {
      field: "age",
      resolve: dixtureFns.Int,
    }, // 4. We can even define our own resolution functions, as far as they return the expected type
    {
      field: "bankBalance",
      resolve: () => {
        if (dixtureFns.Bool()) {
          return 10000000n;
        }
        return 0n;
      },
    }, // 5. We can also omit rules, the field might not be important after all,
  ),
  // 6. We also handle interfaces!
  new InterfaceRuleSet<DateRange>(
    "DateRange", // 7. Set a key so we can resolve your interface later down the road
    // 8. And describe its rules
    {
      field: "startsAt",
      resolve: () => new Date(),
    },
    {
      field: "endsAt",
      resolve: dixtureFns.FutureDate,
    },
  ),
);

// 9. After everything is done just call build(YourClass)
const { age, bankBalance, name } = factory.build(Person);
console.table([age, bankBalance, name]);

// 10. Or build<YourInterface>(yourInterfaceKey);
const { startsAt, endsAt } = factory.build<DateRange>("DateRange");
console.table([startsAt.toLocaleDateString(), endsAt.toLocaleDateString()]);

// 11. Enjoy setting your rules only once!
/**
  * ┌───────┬─────────────────────┐
  * │ (idx) │       Values        │
  * ├───────┼─────────────────────┤
  * │   0   │         487         │
  * │   1   │      10000000n      │
  * │   2   │ "745.5967546042531" │
  * └───────┴─────────────────────┘
 */
/**
 * ┌───────┬───────────────────┐
 * │ (idx) │      Values       │
 * ├───────┼───────────────────┤
 * │   0   │ "Mon Sep 14 2020" │
 * │   1   │ "Thu Sep 17 2020" │
 * └───────┴───────────────────┘
 */
```

You can check out all our samples at the [samples directory](./samples/)! Looking at our [unit tests](./tests/) might be helpful as well!

## 🛣 Roadmap

### 🚩 v0.1.0

+ [X] Create random values for primitive types (*aka numbers, strings and booleans*)
+ [X] Create and assign random values for primitive types (*ditto for the aka above*)
+ [X] Validate generation parameters

### 🏁 v0.2.0

+ [X] Create and assign random values for all primitive fields of an object (*aka numbers, strings and booleans*)
+ [X] Create a Factory API (*aka users can ask a single Factory for an object T and they'll have it*)

### 🍾 v0.2.1

+ [X] Allow for random generation of interfaces (*aka inputs don't need to be a class*)

### 🍔 v0.2.2

+ [X] Allow for random generation of dates (*aka we can generate future and past dates for consumers*)

### 🌊 v0.3.0

+ [ ] Create a Builder/Fluent API for RuleSets (*aka allow consumers to chain customization calls*)

### 💭 Someday

+ [ ] Allow recursive generation (*aka we can handle nested objects*)
+ [ ] Allow customization of the generation strategy (*aka consumers can tweak how we generate objects*)

## ➕ Contributing to this Project

Simply follow the standards and ensure all the tests are ✅, then create a pull request! 😄

### 📚 Code Standards

> W.I.P.

### 🔨 Building

Well, you don't *really* need to build this but you could use `deno cache` to cache the dependencies and ensure everything is okay or `deno bundle` to create a single file with all the required dependencies.

### 🤖 Testing

We use `Rhum` for our tests so you'll need to run `deno tests --allow-env` to run all the tests.
