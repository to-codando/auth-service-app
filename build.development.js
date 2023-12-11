import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";

import * as esbuild from "esbuild";
import copy from "esbuild-copy-files-plugin";
import aliasPlugin from "esbuild-plugin-path-alias";
import { buildEnvironment } from "./build.environment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
const isDevMode = process.env.NODE_ENV === "development";

const getGlobFiles = async (directory, ignore = null) => {
  const files = await glob(directory, { ignore: ignore });
  return files;
};

const runBuild = async () => {
  const testFiles = await getGlobFiles("./src/tests/**/*.spec.ts", "*/**/*.spec.md");
  const mock = await getGlobFiles("./src/mock/**/*.ts");

  esbuild.build({
    plugins: [
      buildEnvironment({ environment: "development" }),
      aliasPlugin({
        "@/services": path.resolve(__dirname, "./src/services"),
        "@/utils": path.resolve(__dirname, "./src/utils"),
        "@/mock": path.resolve(__dirname, "./src/mock/"),
      }),
    ],
 
    supported: {
      "dynamic-import": true,
    },
    platform: "browser",
    format: "esm",
    bundle: true,
    write: true,
    entryPoints: ["src/main.ts", ...testFiles, ...mock],
    tsconfig: "./tsconfig.json",
    outdir: "./dist",
    keepNames: true,
    treeShaking: !isDevMode,
    sourcemap: isDevMode,
    minify: !isDevMode,
    target: isDevMode ? ["esnext"] : ["es2020"],
    loader: {
      ".js": "ts",
    },
  });
};

runBuild();
