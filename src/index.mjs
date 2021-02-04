// @format
import captureChrome from "capture-chrome";
import createWorker from "expressively-mocked-fetch";

const defaultOptions = {
  width: 1024,
  height: 768,
  wait: 0
};

export async function capture(input, options) {
  options = { ...defaultOptions, ...options };
  const worker = await createWorker(
    `
    app.get("/", (req, res) => {
      res.status(200).send(\`${input}\`);
    });
  `
  );

  return await captureChrome({
    url: `http://localhost:${worker.port}`,
    width: options.width,
    height: options.height,
    wait: options.wait
  });
}

export function htmlEnvelope(body = "", head = "") {
  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title></title>
    <style>
      body {
        text-rendering: geometricPrecision;
      }
    </style>
    ${head}
  </head>
  <body>
    ${body}
  </body>
</html>
  `;
}
