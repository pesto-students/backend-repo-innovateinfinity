import * as dotenv from "dotenv";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,

  profilesSampleRate: 1.0,
});

function testErrors() {
  try {
    testFunction();
  } catch (e) {
    Sentry.captureException(e);
  }
}

testErrors();
