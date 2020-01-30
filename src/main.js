#!/usr/bin/env node
const process = require("process");
const { join } = require("path");
const { spawn } = require("child_process");
const { readFile } = require("fs");

try {
  console.log("Starting publish action...");
  main();
} catch (error) {
  console.log(error.message);
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
