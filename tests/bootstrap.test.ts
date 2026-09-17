import { describe, expect, it } from "vitest";
import { bootstrap } from "../src/bootstrap.js";

describe("bootstrap", () => {
  it("rejects until the application runtime is implemented", async () => {
    await expect(bootstrap()).rejects.toThrow(/not implemented/i);
  });
});
