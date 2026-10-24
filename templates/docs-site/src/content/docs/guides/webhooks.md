---
title: Webhooks
description: Check that an event came from Sahel, then handle it.
---

Sahel signs every webhook with your endpoint's secret. Check the signature before trusting the body:

```js
import { verifyWebhook } from "@sahel/sdk";

const event = verifyWebhook(rawBody, request.headers["sahel-signature"], process.env.SAHEL_WEBHOOK_SECRET);
if (event.type === "invoice.paid") {
  // Mark the order as paid.
}
```

`verifyWebhook` throws if the signature doesn't match. Use the raw request body: a parsed and re-serialised body
won't match.
