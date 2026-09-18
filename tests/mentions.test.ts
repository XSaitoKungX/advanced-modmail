import { describe, expect, it } from "vitest";
import { NO_PINGS, resolveMentions } from "../src/discord/mentions/policy.js";

describe("mentions policy", () => {
  it("defaults to no notifications", () => {
    const policy = resolveMentions();
    expect(policy.users).toEqual([]);
    expect(policy.roles).toEqual([]);
    expect(policy.repliedUser).toBe(false);
    expect(policy).toEqual(NO_PINGS);
  });

  it("allows only explicitly listed users and roles", () => {
    const policy = resolveMentions({
      users: ["123456789012345678"],
      roles: ["234567890123456789"],
      repliedUser: true,
    });
    expect(policy.users).toEqual(["123456789012345678"]);
    expect(policy.roles).toEqual(["234567890123456789"]);
    expect(policy.repliedUser).toBe(true);
  });

  it("cannot express @everyone or @here", () => {
    // MentionsPolicy has no everyone/here fields by construction.
    const policy = resolveMentions();
    expect(policy).not.toHaveProperty("everyone");
    expect(policy).not.toHaveProperty("here");
    expect(Object.keys(policy).sort()).toEqual([
      "repliedUser",
      "roles",
      "users",
    ]);
  });

  it("returns a frozen policy", () => {
    const policy = resolveMentions({ users: ["1"] });
    expect(Object.isFrozen(policy)).toBe(true);
    expect(Object.isFrozen(policy.users)).toBe(true);
  });

  it("does not freeze arrays owned by the caller", () => {
    const users = ["1"];
    const policy = resolveMentions({ users });
    expect(Object.isFrozen(users)).toBe(false);
    expect(policy.users).not.toBe(users);
    expect(() => users.push("2")).not.toThrow();
  });
});
