---
title: Configuration
description: Timeouts, retries and the base URL.
---

Everything goes in one options object:

```js
const sahel = new Sahel({
  apiKey: process.env.SAHEL_KEY,
  timeout: 10_000,
  retries: 3,
});
```

| Option | Default | |
| --- | --- | --- |
| `timeout` | `30000` | Milliseconds before a request is abandoned. |
| `apiKey` | | Your secret API key. Required. |
| `retries` | `3` | How many times a request that failed on the network is tried again. |
| `baseUrl` | `https://api.sahel.example` | Point it at a mock server in tests. |
