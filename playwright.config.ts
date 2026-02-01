import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  webServer: {
    command: "pnpm dev -- --port 3000",
    port: 3000,
    reuseExistingServer: true
  },
  use: {
    baseURL: "http://localhost:3000"
  }
});
