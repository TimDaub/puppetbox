// @format
import test from "ava";
import looksSame from "looks-same";
import tempDir from "temp-dir";
import { existsSync, writeFileSync } from "fs";
import imgur from "imgur";

import { capture, htmlEnvelope } from "../src/index.mjs";

test.skip("bla", async t => {
  const input = htmlEnvelope(`<p style="font-family: Arial;">hello world</p>`);

  const screenshot = await capture(input, {
    width: 100,
    height: 100
  });

  const ssPath = `${tempDir}/testfile.png`;
  writeFileSync(ssPath, screenshot);
  const expectedFilePath = "test/fixtures/helloworld_arial_github.png";

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
        const expectedUL = await imgur.uploadFile(expectedFilePath);
        console.info(`
            Actual: ${actualUL.data.link}
            Expected: ${expectedUL.data.link}
          `);
      }
      t.true(equal);
      res();
    });
  });
});

test("if capturing an image works", async t => {
  const input = htmlEnvelope(`<p>hello world</p>`);

  const screenshot = await capture(input, {
    width: 100,
    height: 100
  });

  const ssPath = `${tempDir}/testfile.png`;
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
        const expectedUL = await imgur.uploadFile(expectedFilePath);
        console.info(`
            Actual: ${actualUL.data.link}
            Expected: ${expectedUL.data.link}
          `);
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
