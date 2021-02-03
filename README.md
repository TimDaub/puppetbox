# puppetbox

![Node.js CI](https://github.com/TimDaub/puppetbox/workflows/Node.js%20CI/badge.svg)

> Capture screenshots of HTML using Chrome's headless mode.

## Requirements

- for node version, see [package.json](./package.json)

## Why puppetbox?

- Its [code base](https://raw.github.com/TimDaub/puppetbox/main/src) is tiny and maintainable.
- It's framework-agnostic. All that is needed to get started is a HTML string.

## Installation

```bash
$ npm i -D puppetbox
```

## Usage

puppetbox allows you to capture screenshots using headless Chrome by entering a
HTML string. For visual regression testing, a screenshot could later be
compared using [`looks-same`](https://github.com/gemini-testing/looks-same).

```js
import capture from "puppetbox";
import { writeFileSync } from "fs";

(async () => {
  const input= "<p>hello world</p>";
  const screenshot = await capture(input, {
    height: 100,
    width: 100
  });
  writeFileSync(`example.png`, screenshot)
})();
```

screenshot of "example.png" below:

![example.png](https://raw.github.com/TimDaub/puppetbox/main/example.png)

## Changelog

### 0.0.1

- Release initial version

## License

See [License](./LICENSE).
