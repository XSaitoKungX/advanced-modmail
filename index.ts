// Application entry point. Startup/composition only - feature behavior lives
// in src/ modules wired together by src/bootstrap.ts.
import { bootstrap } from "./src/bootstrap.js";

await bootstrap();
