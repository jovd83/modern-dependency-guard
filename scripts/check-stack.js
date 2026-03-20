#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const RULES = [
  {
    name: "request",
    status: "deprecated",
    severity: "error",
    replacement: "native fetch or axios",
    reason: "The package is deprecated and modern runtimes now provide fetch."
  },
  {
    name: "request-promise",
    status: "deprecated",
    severity: "error",
    replacement: "native fetch, ky, or axios",
    reason: "This package extends the deprecated request ecosystem."
  },
  {
    name: "request-promise-native",
    status: "deprecated",
    severity: "error",
    replacement: "native fetch, ky, or axios",
    reason: "This package extends the deprecated request ecosystem."
  },
  {
    name: "node-sass",
    status: "deprecated",
    severity: "error",
    replacement: "sass",
    reason: "Dart Sass is the maintained implementation."
  },
  {
    name: "phantomjs",
    status: "deprecated",
    severity: "error",
    replacement: "playwright or puppeteer",
    reason: "PhantomJS is obsolete."
  },
  {
    name: "phantomjs-prebuilt",
    status: "deprecated",
    severity: "error",
    replacement: "playwright or puppeteer",
    reason: "PhantomJS is obsolete."
  },
  {
    name: "protractor",
    status: "deprecated",
    severity: "error",
    replacement: "playwright, cypress, or webdriverio",
    reason: "Protractor reached end-of-life."
  },
  {
    name: "tslint",
    status: "deprecated",
    severity: "error",
    replacement: "eslint with typescript-eslint",
    reason: "TSLint has been retired."
  },
  {
    name: "babel-eslint",
    status: "deprecated",
    severity: "error",
    replacement: "@babel/eslint-parser",
    reason: "The package has been replaced by the official Babel ESLint parser."
  },
  {
    name: "enzyme",
    status: "deprecated",
    severity: "warn",
    replacement: "react-testing-library",
    reason: "Enzyme has not kept pace with modern React releases."
  },
  {
    name: "moment",
    status: "legacy-compatible",
    severity: "warn",
    replacement: "date-fns, luxon, dayjs, or Intl APIs",
    reason: "Moment is in maintenance mode and is rarely the best greenfield choice."
  },
  {
    name: "jquery",
    status: "legacy-compatible",
    severity: "warn",
    replacement: "native DOM APIs or framework-native patterns",
    reason: "Modern browsers and frameworks replace most new jQuery use cases."
  },
  {
    name: "lodash",
    status: "native-first",
    severity: "warn",
    replacement: "native JavaScript or targeted lodash imports",
    reason: "The full lodash package is often unnecessary in modern code."
  },
  {
    name: "body-parser",
    status: "native-first",
    severity: "warn",
    replacement: "express.json() or express.urlencoded()",
    reason: "Modern Express ships built-in parsers for common cases."
  }
];

function printHelp() {
  console.log(`Usage: node scripts/check-stack.js [project-path] [options]

Scan a Node.js package.json for known deprecated, legacy, or redundant dependencies.

Arguments:
  project-path               Directory containing package.json, or a direct path to package.json.

Options:
  --format <text|json>       Output format. Default: text
  --strict                   Exit with code 2 when findings are present
  --include <scopes>         Comma-separated extra scopes: optional,peer
  --help                     Show this message
`);
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    format: "text",
    strict: false,
    include: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--strict") {
      options.strict = true;
      continue;
    }

    if (arg === "--format") {
      options.format = argv[index + 1] || "";
      index += 1;
      continue;
    }

    if (arg === "--include") {
      options.include = (argv[index + 1] || "")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);
      index += 1;
      continue;
    }

    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    options.target = arg;
  }

  if (!["text", "json"].includes(options.format)) {
    throw new Error(`Unsupported format: ${options.format}`);
  }

  return options;
}

function resolvePackagePath(target) {
  const resolved = path.resolve(target);

  if (!fs.existsSync(resolved)) {
    throw new Error(`Path does not exist: ${resolved}`);
  }

  const stats = fs.statSync(resolved);
  return stats.isDirectory() ? path.join(resolved, "package.json") : resolved;
}

function loadPackageJson(packagePath) {
  if (!fs.existsSync(packagePath)) {
    throw new Error(`No package.json found at: ${packagePath}`);
  }

  try {
    return JSON.parse(fs.readFileSync(packagePath, "utf8"));
  } catch (error) {
    throw new Error(`Failed to parse JSON in ${packagePath}: ${error.message}`);
  }
}

function determineScopes(include) {
  const scopes = ["dependencies", "devDependencies"];

  if (include.includes("optional")) {
    scopes.push("optionalDependencies");
  }

  if (include.includes("peer")) {
    scopes.push("peerDependencies");
  }

  return scopes;
}

function scanPackageJson(pkg, scopes) {
  const findings = [];

  for (const scope of scopes) {
    const dependencies = pkg[scope] || {};

    for (const [dependency, version] of Object.entries(dependencies)) {
      const rule = RULES.find((candidate) => candidate.name === dependency);

      if (!rule) {
        continue;
      }

      findings.push({
        name: dependency,
        version,
        scope,
        status: rule.status,
        severity: rule.severity,
        replacement: rule.replacement,
        reason: rule.reason
      });
    }
  }

  findings.sort((left, right) => {
    const severityOrder = { error: 0, warn: 1 };
    return severityOrder[left.severity] - severityOrder[right.severity] || left.name.localeCompare(right.name);
  });

  return findings;
}

function buildSummary(findings) {
  return {
    total: findings.length,
    errors: findings.filter((item) => item.severity === "error").length,
    warnings: findings.filter((item) => item.severity === "warn").length
  };
}

function renderText(packagePath, scopes, findings) {
  const lines = [];
  const summary = buildSummary(findings);

  lines.push(`Scanned ${packagePath}`);
  lines.push(`Scopes: ${scopes.join(", ")}`);

  if (findings.length === 0) {
    lines.push("Result: no flagged dependencies found.");
    return lines.join("\n");
  }

  lines.push(`Result: ${summary.total} finding(s) (${summary.errors} error, ${summary.warnings} warning).`);

  for (const finding of findings) {
    lines.push("");
    lines.push(`[${finding.severity}] ${finding.name}@${finding.version} (${finding.scope})`);
    lines.push(`Status: ${finding.status}`);
    lines.push(`Prefer: ${finding.replacement}`);
    lines.push(`Reason: ${finding.reason}`);
  }

  return lines.join("\n");
}

function run(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);

  if (options.help) {
    printHelp();
    return 0;
  }

  const packagePath = resolvePackagePath(options.target);
  const pkg = loadPackageJson(packagePath);
  const scopes = determineScopes(options.include);
  const findings = scanPackageJson(pkg, scopes);
  const summary = buildSummary(findings);

  if (options.format === "json") {
    console.log(JSON.stringify({
      packagePath,
      scopes,
      summary,
      findings
    }, null, 2));
  } else {
    console.log(renderText(packagePath, scopes, findings));
  }

  if (options.strict && findings.length > 0) {
    return 2;
  }

  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = run();
  } catch (error) {
    console.error(`check-stack: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  RULES,
  buildSummary,
  determineScopes,
  parseArgs,
  renderText,
  resolvePackagePath,
  run,
  scanPackageJson
};
