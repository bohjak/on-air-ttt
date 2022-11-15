import { checkDiags } from "../check";
import { CellState } from "../field-slice";

const getf = () => new Array(9).fill(CellState.Empty);

test("getf returns an empty field", () => {
  const f = getf();
  expect(f).toHaveLength(9);
  expect(f.every((c) => c === CellState.Empty));
});

describe("checkDiags", () => {
  const tests: [input: CellState[], expected: boolean][] = [
    [getf(), false],
    [{ ...getf(), 0: CellState.X }, false],
  ];

  test.each(tests)(
    "returns true only if a diagonal is complete",
    (input, expected) => {
      const result = checkDiags(input);
      expect(result).toBe(expected);
    }
  );
});
