---
title: Client
description: Every method on the Sahel client.
slug: 1.0/reference/client
---

## `new Sahel(key, options?)`

Creates a client. `key` is your secret API key; see [configuration](/1.0/guides/configuration/) for `options`.

## `sahel.createInvoice(input)`

| Field | Type | |
| --- | --- | --- |
| `customer` | `string` | The customer's id. |
| `amount` | `number` | In the currency's smallest unit (kobo for NGN). |
| `currency` | `string` | An ISO 4217 code. |

Returns the invoice.

## `sahel.getInvoice(id)`

Returns the invoice, or throws `NotFoundError`.
