import {
  dixtureFns,
  RuleSet,
  DixtureFactory,
} from "https://deno.land/x/dixture@v0.2.0/mod.ts";

class Person {
  name: string = "";
  age: number = 0;
  bankBalance: bigint = 1n;
  isAlive: boolean = true;
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
    }, // 5. We can also omit rules, the field might not be important after all
  ),
);

// 6. After everything is done just call build(YourClass)
const { age, bankBalance, name } = factory.build(Person);
console.table([age, bankBalance, name]);

// 7. Enjoy setting your rules only once!
/**
  * ┌───────┬─────────────────────┐
  * │ (idx) │       Values        │
  * ├───────┼─────────────────────┤
  * │   0   │         487         │
  * │   1   │      10000000n      │
  * │   2   │ "745.5967546042531" │
  * └───────┴─────────────────────┘
 */
