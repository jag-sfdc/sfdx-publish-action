#!/usr/bin/env node
const process = require("process");
const { join } = require("path");
const { spawn } = require("child_process");
const { readFile } = require("fs");

try {
  console.log("Starting publish action...");
  main();
}

async function main() {
  const dir = process.env.GITHUB_WORKSPACE || "/github/workspace";
  await yarnInstall(dir);
}

async function publishPackage(dir, config, version) {
  await run(
    dir,
    "yarn",
    "publish",
    "--non-interactive",
    "--new-version",
    version
  );

  console.log("Version has been published successfully:", version);
}

async function yarnInstall(dir) {
  await run(
    dir,
    "yarn",
    "install"
  );
  console.log("Yarn install successfully run");
}
