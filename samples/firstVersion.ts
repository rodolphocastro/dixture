import {
  assignField,
  createFieldValue,
} from "https://deno.land/x/dixture@v0.1.0/mod.ts";

interface Person {
  name: string;
  age: number;
  isAlive: boolean;
}

const subject: Person = {
  age: 1,
  isAlive: false,
  name: "A Person",
};

const result = createFieldValue<Person>(subject, "name");
console.log(result);

assignField(subject, "age", {
  min: 1,
  max: 100,
});
console.log(subject.age);

assignField(subject, "isAlive");
console.log(subject.isAlive);
