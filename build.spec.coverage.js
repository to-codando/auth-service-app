import { dirname, resolve } from "path";
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

  const configBuild = {
    plugins: [
      buildEnvironment({ environment: "development" }),
      aliasPlugin({
        "@/services": resolve(__dirname, "./src/services"),
        "@/utils": resolve(__dirname, "./src/utils"),
        "@/mock": resolve(__dirname, "./src/mock/"),
      }),
    ],

    platform: "browser",
    format: "esm",
    bundle: true,
    write: true,
    entryPoints: ["src/main.ts", ...testFiles, ...mock],
    tsconfig: "./tsconfig.spec.json",
    outdir: "./dist",
    external: ["http", "canvas"],
    treeShaking: false,
    sourcemap: true,
    minify: false,
    target: isDevMode ? ["esnext"] : ["es2018"],
    loader: {
      ".js": "ts",
    },
  };

  try {
    await esbuild.build(configBuild);
    console.log("Finished build update.");
    process.exit(0);
  } catch (errors) {
    console.log(errors);
  }
};

runBuild();
