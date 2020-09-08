import { Rhum, assertStringContains, assert } from "./deps.ts";
import { createFieldValue } from "../src/_simpleGenerator.ts";

interface Subject {
  aNumericField: number;
  aStringField: string;
  aBooleanField: boolean;
}

Rhum.testPlan("Simple Generator", () => {
  let subject: Subject;

  Rhum.beforeAll(() => {
    subject = {
      aBooleanField: false,
      aNumericField: 42,
      aStringField: "my string",
    };
  });

  Rhum.testSuite("createField", () => {
    Rhum.testCase("1. When given a string field should return a string", () => {
      const result = createFieldValue(subject, "aStringField") as string;
      assertStringContains(result, "aStringField");
    });
    Rhum.testCase(
      "2. When given a boolean field should return a boolean",
      () => {
        const result = createFieldValue(subject, "aStringField") as boolean;
        assert(result != null);
      },
    );
    Rhum.testCase(
      "3. When given a number field should return a number",
      () => {
        const result = createFieldValue(subject, "aNumericField") as number;
        assert(result != null);
      },
    );
  });
});

Rhum.run();
