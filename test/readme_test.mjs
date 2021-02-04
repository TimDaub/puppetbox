// @format
import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";
import test from "ava";
import { readFileSync } from "fs";
import { once } from "events";
import looksSame from "looks-same";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("readme usage example", async t => {
  const md = readFileSync(path.resolve(__dirname, "../README.md"));

  const text = md.toString();
  const expr = new RegExp("```(?:js|javascript)\\n([\\s\\S]*?)```", "gm");
  const example = `
  \`\`\`js
    const hello = "world";
  \`\`\`
  `;

  let [matchRes] = example.match(expr);
  let [readmeMatch] = text.match(expr);
  readmeMatch = readmeMatch.replace("```js\n", "");
  readmeMatch = readmeMatch.replace("\n```", "");
  readmeMatch = readmeMatch.replace(
    "puppetbox",
    `file://${path.resolve(__dirname, "../src/index.mjs")}`
  );

  const worker = new Worker(new URL(`data:text/javascript,${readmeMatch}`));

  t.plan(1);
  return new Promise(resolve => {
    looksSame(
      "example.png",
      "test/fixtures/helloworld.png",
      (err, { equal }) => {
        t.true(equal);
        resolve();
      }
    );
  });
});
