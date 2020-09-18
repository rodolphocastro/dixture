# Dixture

Dixture helps you create random data for your tests, with zero external dependencies!

## 🚥 Current Status

**Master status** ![Build and Test](https://github.com/rodolphocastro/dixture/workflows/Build%20and%20Test/badge.svg?branch=master)

**Project status**: *Under development*

**Latest stable version**: *v0.2.2*

## 🏆 Acknowledgements

Dixture is *loosely* based on the great [AutoFixture](https://github.com/AutoFixture/AutoFixture) library that exists on the `.NET` environment.

I've used this library for so long for my Unit and Integration tests that I needed to, somehow, get some of its functionality when working on my `Deno`'s tests.

Thus I began working on this project.

## ⚡ Getting Started

Simply import us by `deno.land/x/` and use your favorite flavor of test data generation!

*As of v0.2.2* you can pick from two "flavors":

1. Functions that create and/or assign fields for your classes and instances
2. A Factory API that allows you to write down rules for your classes

```typescript
import {
  dixtureFns,
  RuleSet,
  DixtureFactory,
  InterfaceRuleSet,
} from "https://deno.land/x/dixture@v0.2.2/mod.ts";

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

class ReallyComplexPerson extends Person {
  child?: Person;
  lifeSpan?: DateRange;

  get anwserToTheUltimateQuestionOfLifeTheUniverseAndEverything() {
    return 42;
  }
}

const dateRangeKey = "DateRange";
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
    dateRangeKey, // 7. Set a key so we can resolve your interface later down the road
    // 8. And describe its rules
    {
      field: "startsAt",
      resolve: () => new Date(),
    },
    {
      field: "endsAt",
      resolve: () => new Date(),
    },
  ),
);

// 9. After everything is done just call build(YourClass)
const firstPerson = factory.build(Person);
console.dir(firstPerson);
/**
 * Person { name: "315.5646467397356", age: 625, bankBalance: 0n, isAlive: true }
 */

// 10. Or build<YourInterface>(yourInterfaceKey);
const dummyRange = factory.build<DateRange>("DateRange");
console.dir(dummyRange);
/**
 * { startsAt: 2020-09-18T01:51:02.598Z, endsAt: 2020-09-18T01:51:02.598Z }
 */

// 11. To resolve nested objects (ie complex objects inside other objects) add new RuleSets to an existing Factory!
factory.addRuleSet(
  new RuleSet(
    ReallyComplexPerson,
    {
      field: "name",
      resolve: dixtureFns.String,
    },
    {
      field: "age",
      resolve: dixtureFns.Int,
    },
    {
      field: "bankBalance",
      resolve: () => {
        if (dixtureFns.Bool()) {
          return 10000000n;
        }
        return 0n;
      },
    },
    {
      // 12. And point the resolve property to the factory itself!
      field: "child",
      resolve: () => factory.build(Person),
    },
    {
      // 13. Also works with interfaces 🥳
      field: "lifeSpan",
      resolve: () => factory.build(dateRangeKey),
    },
  ),
);

// 14. Enjoy having to configure your test data only once!
const complexPerson = factory.build(ReallyComplexPerson);
console.dir(complexPerson);

/**
 * ReallyComplexPerson {
 * name: "795.4315752116036",
 * age: 112,
 * bankBalance: 10000000n,
 * isAlive: true,
 * child: Person { name: "321.6812139776549", age: 88, bankBalance: 10000000n, isAlive: true },
 * lifeSpan: { startsAt: 2020-09-18T01:51:02.599Z, endsAt: 2020-09-18T01:51:02.599Z }
 *}
 */

```

You can check out all our samples at the [samples directory](./samples/)! Looking at our [unit tests](./tests/) might be helpful as well!

## 🛣 Roadmap

### 🚩 v0.1.0

+ [X] Create random values for primitive types (*ie numbers, strings and booleans*)
+ [X] Create and assign random values for primitive types (*ditto for the aka above*)
+ [X] Validate generation parameters

### 🏁 v0.2.0

+ [X] Create and assign random values for all primitive fields of an object (*ie numbers, strings and booleans*)
+ [X] Create a Factory API (*ie users can ask a single Factory for an object T and they'll have it*)

### 🍾 v0.2.1

+ [X] Allow for random generation of interfaces (*ie inputs don't need to be a class*)

### 🍔 v0.2.2

+ [X] Allow for random generation of dates (*ie we can generate future and past dates for consumers*)
+ [X] Allow recursive generation (*ie we can handle nested objects*)
+ [X] Allow customization of the generation strategy (*ie consumers can tweak how we generate objects*)

### 🌊 v0.3.0

+ [ ] Create a Builder/Fluent API for RuleSets (*aka allow consumers to chain customization calls*)

### 💭 Someday

+ [ ] Do not require `const / magic strings` to identify Interfaces (*ie consumers do not need to keep track of their interface keys*)
+ [ ] Handle some degree of automatic generation (*ie we can figure out, automatically, how to build classes and interfaces*)

## ➕ Contributing to this Project

Simply follow our goals, respect the `.editorconfig` set in the repository and ensure all the tests are ✅, then create a pull request! 😄

If you think a refactor is important for performance or for making the code clearer please go ahead and do it!

If you found a bug please [write up a new issue](https://github.com/rodolphocastro/dixture/issues/new/choose) and let us know. Remember to add a snippet whenever possible as we could use that to build a test case and ensure our bug never happens again.

### 📚 Dixture Goals

Those are Dixture core goals:

#### No invasive APIs

Our APIs should **never** be invasive to consumers. What we mean by that is that **we should never**, ever, **expect someone to change the way their classes/interfaces/logics work just to use our module**!

This does impose some limitations such as never using `@attributes` that would pollute models/dtos/whatever but it **ensures people can adopt and leave** Dixture easily!

#### No hardcoded singletons

We should **never expose a hardcoded singleton**. We should **trust that our consumers know best how to setup their tests** and environments.

#### Minimum Dependencies

**External dependencies** might be necessary as Dixture grows but they **should be kept to a minimum**. This doesn't mean we'll always refuse those but they should only be brought in when absolutely necessary. Remember: our goal is to stay as light as possible and as non-invasive as we can!

Do you think you can further enhance Dixture with the help of an external module? Feel free to fork us and create a new module that leverages Dixture + whichever other modules you need!

> For instance I can see this happening in order to inject Dixture into a `Dependency Injection` module automatically for our consumers.

Note: This doesn't apply to `std` modules as those are official modules.

#### No external calls!

**Under no scenario Dixture should call upon external systems**, by no protocol (HTTP, gRPC, whatever).

**Our consumers trust us to setup their test data and we should never break that trust**. Even tho calling a mock/placeholder/faker API might be tempting to get better data we should allow this choice to be done by consumers themselves.

> Again, as with dependencies, if you think this is really helpful for a consumer feel free to fork us and create a new module that bundles Dixture + the external calls you might need!

### 🔨 Building

Well, you don't *really* need to build this but you could use `deno cache` to cache the dependencies and ensure everything is okay or `deno bundle` to create a single file with all the required dependencies.

### 🤖 Testing

We use `Rhum` for our tests so you'll need to run `deno tests --allow-env` to run all the tests.
