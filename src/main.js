#!/usr/bin/env node
const core = require('@actions/core');
const github = require('@actions/github');
const process = require("process");
const { join } = require("path");
const { spawn } = require("child_process");
const { readFile } = require("fs");

async function main() {
  console.log("Starting publish action...");
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
