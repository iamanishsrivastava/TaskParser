import { parseTask } from "../../services/parser/parseTask";

test("parses natural language task", () => {
  const input = "submit assignment by tomorrow 5pm priority high";
  const result = parseTask(input);
  expect(result.title).toBe("submit assignment");
  expect(result.priority).toBe("high");
  expect(result.dueDate).not.toBeNull();
});
