import { Rhum, assert, fail } from "./deps.ts";
import { DixtureFactory, RuleSet, dixtureFns } from "../src/_factory.ts";

/**
 * Say my name... I guess?
 */
class MySubject {
  name = "Heisenberg";
  age = 42;
  isAlive = false;
  invoiced = 100000n;
}

Rhum.testPlan("Factories", () => {
  Rhum.testSuite("1. RuleSet<T>", () => {
    Rhum.testCase(
      "1. Should be constructable without rules",
      () => {
        try {
          new RuleSet<MySubject>(MySubject);
        } catch (error) {
          fail(`Creation failed with error ${error}`);
        }
      },
    );

    Rhum.testCase(
      "2. Should allow rules with builtin resolves",
      () => {
        const { name } = new MySubject();
        const subject = new RuleSet(MySubject, {
          field: "name",
          resolve: dixtureFns.String,
        });
        const result = subject.build();
        assert(name !== result.name);
      },
    );

    Rhum.testCase(
      "3. Should allow rules with custom resolves",
      () => {
        const { name } = new MySubject();
        const subject = new RuleSet(MySubject, {
          field: "name",
          resolve: () => "Walter White",
        });
        const result = subject.build();
        assert(name !== result.name, "We aren't goddamn right ☹");
      },
    );

    Rhum.testCase(
      "4. Should allow rules with mixed resolves",
      () => {
        const { name, age } = new MySubject();
        const subject = new RuleSet(MySubject, {
          field: "name",
          resolve: () => "Walter White",
        }, {
          field: "age",
          resolve: dixtureFns.Int,
        });
        const result = subject.build();
        assert(name !== result.name);
        assert(age !== result.age);
      },
    );
  });

  Rhum.testSuite("2. DixtureFactory", () => {
    Rhum.testCase("1. Should be constructable without parameters", () => {
      try {
        new DixtureFactory();
      } catch (error) {
        fail(`Creation failed with error ${error}`);
      }
    });

    Rhum.testCase(
      "2. Should be constructable with a RuleSet",
      () => {
        try {
          new DixtureFactory(
            new RuleSet(MySubject, {
              field: "age",
              resolve: dixtureFns.Int,
            }, {
              field: "name",
              resolve: dixtureFns.String,
            }),
          );
        } catch (error) {
          fail(`Creation failed with error ${error}`);
        }
      },
    );

    Rhum.testCase(
      "3. Should be constructable with many RuleSets",
      () => {
        class MyOtherSubject {
          bigIntNum: bigint = 0n;
        }
        try {
          new DixtureFactory(
            new RuleSet(MySubject, {
              field: "age",
              resolve: dixtureFns.Int,
            }, {
              field: "name",
              resolve: dixtureFns.String,
            }),
            new RuleSet(MyOtherSubject, {
              field: "bigIntNum",
              resolve: dixtureFns.BigInt,
            }),
          );
        } catch (error) {
          fail(`Creation failed with error ${error}`);
        }
      },
    );

    Rhum.testCase(
      "4. Should build a subject using its ruleset",
      () => {
        const factory = new DixtureFactory(
          new RuleSet(MySubject, {
            field: "age",
            resolve: dixtureFns.Int,
          }, {
            field: "name",
            resolve: dixtureFns.String,
          }),
        );
        const { age, name } = new MySubject();
        const result = factory.build(MySubject);
        assert(age !== result.age);
        assert(name !== result.name);
      },
    );

    Rhum.testCase(
      "5. Should build the right subject when multiple rulesets are available",
      () => {
        class MyOtherSubject {
          bigIntNum: bigint = 0n;
        }

        const factory = new DixtureFactory(
          new RuleSet(MySubject, {
            field: "age",
            resolve: dixtureFns.Int,
          }, {
            field: "name",
            resolve: dixtureFns.String,
          }),
          new RuleSet(MyOtherSubject, {
            field: "bigIntNum",
            resolve: dixtureFns.BigInt,
          }),
        );

        const { bigIntNum } = new MyOtherSubject();
        const result = factory.build(MyOtherSubject);
        assert(result instanceof MyOtherSubject);
        assert(bigIntNum !== result.bigIntNum);
      },
    );
  });
});

Rhum.run();
