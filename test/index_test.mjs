// @format
import test from "ava";
import looksSame from "looks-same";
import tempDir from "temp-dir";
import { existsSync, writeFileSync } from "fs";

import { capture, htmlEnvelope } from "../src/index.mjs";

const randString = () =>
  Math.random()
    .toString(36)
    .substring(7);

test("if capturing an image works", async t => {
  const input = htmlEnvelope(`<p>hello world</p>`);

  const screenshot = await capture(input, {
    width: 100,
    height: 100
  });

  const ssPath = `${tempDir}/${randString()}.png`;
  writeFileSync(ssPath, screenshot);
  const expectedFilePath = "test/fixtures/helloworld.png";

  t.plan(3);
  t.true(existsSync(ssPath));
  t.true(existsSync(expectedFilePath));
  return new Promise(res => {
    looksSame(
      ssPath,
      expectedFilePath,
      { antialiasingTolerance: 5 },
      (err, { equal }) => {
        t.true(equal);
        res();
      }
    );
  });
});

test("if embedding a body and head element works with htmlEnvelope", t => {
  const doc = htmlEnvelope("bcontent", "hcontent");
  t.true(new RegExp("<head>.*hcontent.*<\\/head>", "gms").test(doc));
  t.true(new RegExp("<body>.*bcontent.*<\\/body>", "gms").test(doc));
});

test("that when leaving the head or body input for htmlEnvelope empty, it doesn't influence the generated document", t => {
  const doc = htmlEnvelope("bcontent");
  t.false(doc.includes("undefined"));

  const doc2 = htmlEnvelope();
  t.false(doc2.includes("undefined"));
});
