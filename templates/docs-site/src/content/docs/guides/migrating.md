---
title: Migrating to v2
description: What changed between v1 and v2, and how to update.
---

v2 has one breaking change and two additions.

## The client takes one options object

```diff
- const sahel = new Sahel(process.env.SAHEL_KEY, { timeout: 10_000 });
+ const sahel = new Sahel({ apiKey: process.env.SAHEL_KEY, timeout: 10_000 });
```

## New

- [`listInvoices`](/reference/client/#sahellistinvoicesfilters) returns every invoice, page by page, as an async iterator.
- Requests are retried three times instead of two.

Older docs are still here: pick **v1** in the version menu.
