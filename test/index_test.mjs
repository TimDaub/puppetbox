// @format
import test from "ava";
import looksSame from "looks-same";
import tempDir from "temp-dir";
import { existsSync, writeFileSync } from "fs";
import imgur from "imgur";

import { capture, htmlEnvelope } from "../src/index.mjs";

const randString = () =>
  Math.random()
    .toString(36)
    .substring(7);

test.skip("if screenshots that were rendered on different OS can pass looksSame by ignoring anti aliasing", t => {
  const mac = "test/fixtures/helloworld.png";
  const githubAction = "test/fixtures/helloworld_ghaction.png";
  t.plan(1);
  return new Promise(res => {
    looksSame(
      mac,
      githubAction,
      { ignoreAntialiasing: true, antialiasingTolerance: 3 },
      (err, { equal }) => {
        t.true(equal);
        res();
      }
    );
  });
});

test("if screenshots that were rendered on different OS will fail looksSame by comparing anti aliasing", t => {
  const mac = "test/fixtures/helloworld.png";
  const githubAction = "test/fixtures/helloworld_ghaction.png";
  t.plan(1);
  return new Promise(res => {
    looksSame(
      mac,
      githubAction,
      { ignoreAntialiasing: false },
      (err, { equal }) => {
        t.false(equal);
        res();
      }
    );
  });
});

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
    looksSame(ssPath, expectedFilePath, async (err, { equal }) => {
      if (!equal) {
        // NOTE: This section is mainly to debug the tests on GitHub where
        // apparently images are rendered differently than on e.g. my local
        // computer.
        const actualUL = await imgur.uploadFile(ssPath);
        console.info("Actual render", actualUL.data.link);

        const expectedUL = await imgur.uploadFile(expectedFilePath);
        console.info("Expected render", expectedUL.data.link);
      }
      t.true(equal);
      res();
    });
  });
});

test("that matching two renders from two different OS is possible", async t => {
  const input = htmlEnvelope(`<p style="font-family: Arial;">hello world</p>`);

  const screenshot = await capture(input, {
    width: 100,
    height: 100
  });

  const ssPath = `${tempDir}/${randString()}.png`;
  writeFileSync(ssPath, screenshot);
  const expectedFilePath = "test/fixtures/helloworld_arial.png";

  t.plan(3);
  t.true(existsSync(ssPath));
  t.true(existsSync(expectedFilePath));
  return new Promise(res => {
    looksSame(ssPath, expectedFilePath, async (err, { equal }) => {
      if (!equal) {
        // NOTE: This section is mainly to debug the tests on GitHub where
        // apparently images are rendered differently than on e.g. my local
        // computer.
        const actualUL = await imgur.uploadFile(ssPath);
        console.info("Actual render", actualUL.data.link);

        const expectedUL = await imgur.uploadFile(expectedFilePath);
        console.info("Expected render", expectedUL.data.link);
      }
      t.true(equal);
      res();
    });
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
