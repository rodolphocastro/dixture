import {
  Rhum,
  assertStringContains,
  assert,
  assertNotEquals,
  assertThrows,
} from "./deps.ts";
import { assignField, createFieldValue } from "../src/_simpleGenerator.ts";

interface Subject {
  aNumericField: number;
  aStringField: string;
  aBooleanField: boolean;
  aBigIntField: bigint;
  anUndefinedNumber?: number;
}

Rhum.testPlan("Simple Generator", () => {
  let subject: Subject;

  Rhum.beforeAll(() => {
    subject = {
      aBooleanField: false,
      aNumericField: 42,
      aStringField: "my string",
      aBigIntField: 100n,
    };
  });

  Rhum.testSuite("createField", () => {
    Rhum.testCase(
      "1. Should return a string when given a string field",
      () => {
        const { aStringField } = subject;
        const result = createFieldValue(subject, "aStringField") as string;
        assert(result != null);
        assertNotEquals(result, aStringField);
        assertStringContains(result, "aStringField");
      },
    );
    Rhum.testCase(
      "2. Should return a boolean when given a boolean field",
      () => {
        const result = createFieldValue(subject, "aStringField") as boolean;
        assert(result != null);
      },
    );
    Rhum.testCase(
      "3. Should return a boolean when given a number field",
      () => {
        const { aNumericField } = subject;
        const result = createFieldValue(subject, "aNumericField") as number;
        assert(result != null);
        assertNotEquals(result, aNumericField);
      },
    );
    Rhum.testCase(
      "4. Should return a bigint when given a bigint field",
      () => {
        const { aBigIntField } = subject;
        const result = createFieldValue(subject, "aBigIntField") as bigint;
        assert(result != null);
        assertNotEquals(result, aBigIntField);
      },
    );
    Rhum.testCase(
      "5. Should throw when given an undefined field",
      () => {
        assertThrows(() => {
          createFieldValue(subject, "anUndefinedNumber");
        });
      },
    );
    Rhum.testCase(
      "6. Should throw when given an object",
      () => {
        interface NestedSubject {
          mySubject: Subject;
        }
        const newSubject: NestedSubject = {
          mySubject: subject,
        };
        assertThrows(() => {
          createFieldValue(newSubject, "mySubject");
        });
      },
    );
    Rhum.testCase(
      "7. Should throw when given a function",
      () => {
        const improvedSubject = {
          ...subject,
          myFn: () => {
            return true;
          },
        };
        assertThrows(() => {
          createFieldValue(improvedSubject, "myFn");
        });
      },
    );
  });

  Rhum.testSuite("applyField", () => {
    Rhum.testCase("1. Should replace a string with a new value", () => {
      const { aStringField } = subject;
      assignField(subject, "aStringField");
      assertNotEquals(subject.aStringField, aStringField);
      assertStringContains(subject.aStringField, "aStringField");
    });
    Rhum.testCase("2. Should replace a boolean with a value", () => {
      // Not comparing two booleans because its a 50% chance of being equal lol
      assignField(subject, "aBooleanField");
      assert(subject.aBooleanField != null);
    });
    Rhum.testCase("3. Should replace a number with a new value", () => {
      const { aNumericField } = subject;
      assignField(subject, "aNumericField");
      assertNotEquals(subject.aNumericField, aNumericField);
    });
    Rhum.testCase("4. Should replace a bigint with a new value", () => {
      const { aBigIntField } = subject;
      assignField(subject, "aBigIntField");
      assertNotEquals(subject.aBigIntField, aBigIntField);
    });
    Rhum.testCase(
      "5. Should throw when given an undefined field",
      () => {
        assertThrows(() => {
          assignField(subject, "anUndefinedNumber");
        });
      },
    );
    Rhum.testCase(
      "6. Should throw when given an object",
      () => {
        interface NestedSubject {
          mySubject: Subject;
        }
        const newSubject: NestedSubject = {
          mySubject: subject,
        };
        assertThrows(() => {
          assignField(newSubject, "mySubject");
        });
      },
    );
    Rhum.testCase(
      "7. Should throw when given a function",
      () => {
        const improvedSubject = {
          ...subject,
          myFn: () => {
            return true;
          },
        };
        assertThrows(() => {
          assignField(improvedSubject, "myFn");
        });
      },
    );
  });
});

Rhum.run();
