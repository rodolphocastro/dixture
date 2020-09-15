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
      resolve: () => (new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)),
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
