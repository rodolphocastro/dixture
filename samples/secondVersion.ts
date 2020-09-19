import {
  dixtureFns,
  RuleSet,
  DixtureFactory,
  InterfaceRuleSet,
} from "https://deno.land/x/dixture@v0.2.2/mod.ts";

class Person {
  name = "";
  age = 0;
  bankBalance = 1n;
  isAlive = true;
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
