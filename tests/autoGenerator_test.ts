import { Rhum, assert, assertThrows, fail } from "./deps.ts";
import { create } from "../src/_autoGenerator.ts";

interface BaseSubject {
  myString: string;
  myNumber: number;
  myBigInt: bigint;
  myBool: boolean;
}

Rhum.testPlan("Auto Generator", () => {
  Rhum.testSuite("1. create", () => {
    Rhum.testCase(
      "1. Should return a new object when given a class",
      () => {
        class Subject implements BaseSubject {
          myString = "";
          myNumber = 0;
          myBigInt = 1n;
          myBool = false;
        }
        const result = create(Subject);
        assert(result != null);
      },
    );
    Rhum.testCase(
      "2. Should not change class methods when the object is created",
      () => {
        class Subject implements BaseSubject {
          myString = "";
          myNumber = 0;
          myBigInt = 1n;
          myBool = false;

          myAwesomeMethod() {
            this.myString = "lorem";
          }

          myAwfulMethod() {
            return "ipsum";
          }
        }
        const result = create(Subject);
        assert(result != null);
        assert(typeof result.myAwesomeMethod === "function");
        assert(result.myAwfulMethod() === "ipsum");
      },
    );
    Rhum.testCase(
      "3. Should allow for parametrization while the object is created",
      () => {
        class Subject implements BaseSubject {
          myString = "";
          myNumber = 0;
          myBigInt = 1n;
          myBool = false;
        }
        try {
          const result = create(Subject, {
            min: 2,
            max: 100000,
          });
          assert(result != null);
        } catch {
          fail("The function should not throw when valid parameters are given");
        }
      },
    );

    Rhum.testCase(
      "4. Should throw when parametrization is invalid",
      () => {
        class Subject implements BaseSubject {
          myString = "";
          myNumber = 0;
          myBigInt = 1n;
          myBool = false;
        }
        assertThrows(() =>
          create(Subject, {
            min: -2,
            max: -100000,
          })
        );
      },
    );
  });
});

Rhum.run();
