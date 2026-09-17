import { describe, expect, it } from "vitest";
import { main } from "./index.js";

describe("main", () => {
  it("reports that the runtime bootstrap is not implemented yet", () => {
    expect(() => {
      main();
    }).toThrow(/not implemented/i);
  });
});
