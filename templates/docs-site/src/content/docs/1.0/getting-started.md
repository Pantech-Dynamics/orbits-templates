---
title: Getting started
description: Install the SDK and make your first request.
slug: 1.0/getting-started
---

## Install

```sh
npm install @acme/sdk@1
```

## Create a client

Find your API key in the dashboard under **Settings → API keys**.

```js
import { Acme } from "@acme/sdk";

const acme = new Acme(process.env.ACME_KEY);
```

## Make a request

```js
const invoice = await acme.createInvoice({ customer: "cus_123", amount: 25000, currency: "NGN" });
console.log(invoice.id);
```

Next, read about [configuration](/1.0/guides/configuration/).
