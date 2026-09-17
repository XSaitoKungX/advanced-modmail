// Application bootstrap: loads and validates configuration, initializes
// persistence, starts the Discord client, and optionally starts the web/API
// server (see ARCHITECTURE.md). Not implemented yet - tracked by later
// Phase 1+ issues in TODO.md.
export function bootstrap(): Promise<never> {
  return Promise.reject(
    new Error("Not implemented: application bootstrap is tracked separately."),
  );
}
