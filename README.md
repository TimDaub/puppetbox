# puppetbox

> Capture screenshots of HTML using Chrome's headless mode.

## Installation

```bash
$ npm i -D puppetbox
```

## Usage

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

![example.png](https://raw.github.com/TimDaub/puppetbox/main/example.png)

## Changelog

### 0.0.1

- Release initial version

## License

See [License](./LICENSE).
