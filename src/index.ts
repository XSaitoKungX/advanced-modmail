// Application entry point and composition root. This is the only module
// allowed to wire all layers (domain, application, infrastructure, transport,
// presentation) together.
//
// The runtime bootstrap (Discord client, configuration, persistence) is
// intentionally not implemented yet; it is delivered by later issues in
// TODO.md. This module exists so the build, lint, and test toolchain has real
// input to operate on.
export function main(): never {
  throw new Error("Not implemented: runtime bootstrap is tracked separately.");
}
