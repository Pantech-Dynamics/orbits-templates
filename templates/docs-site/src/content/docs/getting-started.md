---
title: Getting started
description: Install the SDK and make your first request.
---

## Install

```sh
npm install @sahel/sdk@2
```

## Create a client

Find your API key in the dashboard under **Settings → API keys**.

```js
import { Sahel } from "@sahel/sdk";

const sahel = new Sahel({ apiKey: process.env.SAHEL_KEY });
```

## Make a request

```js
const invoice = await sahel.createInvoice({ customer: "cus_123", amount: 25000, currency: "NGN" });
console.log(invoice.id);
```

Next, read about [configuration](/guides/configuration/). Coming from v1? See [migrating to v2](/guides/migrating/).
