---
title: Pagination
description: Walk through every invoice without thinking about pages.
---

New in v2. List methods return an async iterator that fetches the next page as you go:

```js
for await (const invoice of sahel.listInvoices({ status: "paid" })) {
  console.log(invoice.id, invoice.amount);
}
```

To take only some, stop the loop with `break`; no further pages are fetched.
