// @format
import captureChrome from "capture-chrome";
import createWorker from "expressively-mocked-fetch";

function defaultDOM(input) {
  // NOTE: Take from: https://github.com/TimDaub/mynimal-html5-boilerplate
  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title></title>
  </head>
  <body>
    ${input}
  </body>
</html>
`;
}

const defaultOptions = {
  width: 1024,
  height: 768,
  wait: 0
};

export default async function capture(input, options) {
  options = { ...defaultOptions, ...options };
  const page = defaultDOM(input);
  const worker = await createWorker(
    `
    app.get("/", (req, res) => {
      res.status(200).send(\`${page}\`);
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
