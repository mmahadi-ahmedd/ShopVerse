import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { environment: "node", env: { CDN_URL: "https://cdn.test", AWS_REGION: "ap-southeast-2", DDB_TABLE: "test" } },
});