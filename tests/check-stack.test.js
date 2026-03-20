const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const scriptPath = path.join(__dirname, "..", "scripts", "check-stack.js");
const fixturesPath = path.join(__dirname, "fixtures");

function runCli(args) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    encoding: "utf8"
  });
}

test("reports no findings for a modern fixture", () => {
  const modernApp = path.join(fixturesPath, "modern-app");
  const result = runCli([modernApp]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /no flagged dependencies found/i);
});

test("returns structured json findings for a legacy fixture", () => {
  const legacyApp = path.join(fixturesPath, "legacy-app");
  const result = runCli([legacyApp, "--format", "json"]);

  assert.equal(result.status, 0);

  const payload = JSON.parse(result.stdout);
  assert.equal(payload.summary.total, 4);
  assert.equal(payload.summary.errors, 3);
  assert.equal(payload.summary.warnings, 1);
  assert.deepEqual(
    payload.findings.map((finding) => finding.name),
    ["node-sass", "request", "tslint", "moment"]
  );
});

test("strict mode fails the process when findings exist", () => {
  const legacyApp = path.join(fixturesPath, "legacy-app");
  const result = runCli([legacyApp, "--strict"]);

  assert.equal(result.status, 2);
  assert.match(result.stdout, /4 finding\(s\)/i);
});
