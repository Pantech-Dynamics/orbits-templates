---
title: Configuration
description: Timeouts, retries and the base URL.
slug: 1.0/guides/configuration
---

Pass options as the second argument:

```js
const acme = new Acme(process.env.ACME_KEY, {
  timeout: 10_000,
  retries: 2,
});
```

| Option | Default | |
| --- | --- | --- |
| `timeout` | `30000` | Milliseconds before a request is abandoned. |
| `retries` | `2` | How many times a request that failed on the network is tried again. |
| `baseUrl` | `https://api.acme.example` | Point it at a mock server in tests. |
