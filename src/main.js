#!/usr/bin/env node
const process = require("process");
const { join } = require("path");
const { spawn } = require("child_process");
const { readFile } = require("fs");

try {
  console.log("Starting publish action...");
  main();
  console.log("Finished publish action!");
} catch (error) {
  console.log(error.message);
}

function main() {
  const dir = process.env.GITHUB_WORKSPACE || "/github/workspace";
  incrementVersion(dir, "patch");  
  yarnInstall(dir);
  publishPackage(dir)
}

function incrementVersion(dir, versionType) {
  run(
    dir,
    "npm",
    "version",
    versionType
  );
  console.log("Increment version run successfully run");
}

function yarnInstall(dir) {
  run(
    dir,
    "yarn",
    "install"
  );
  console.log("Yarn install successfully run");
}

function publishPackage(dir) {
  run(
    dir,
    "yarn",
    "publish",
  );
  console.log("Package has been published successfully");
}

function run(cwd, command, ...args) {
  console.log("Executing:", command, args.join(" "));
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd,
      stdio: ["ignore", "ignore", "pipe"]
    });
    const buffers = [];
    proc.stderr.on("data", data => buffers.push(data));
    proc.on("error", () => {
      reject(new Error(`command failed: ${command}`));
    });
    proc.on("exit", code => {
      if (code === 0) {
        resolve(true);
      } else {
        const stderr = Buffer.concat(buffers)
          .toString("utf8")
          .trim();
        if (stderr) {
          console.log(`command failed with code ${code}`);
          console.log(stderr);
        }
        reject(new ExitError(code));
      }
    });
  });
}
