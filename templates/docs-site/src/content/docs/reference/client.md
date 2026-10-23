---
title: Client
description: Every method on the Acme client.
---

## `new Acme(options)`

Creates a client. See [configuration](/guides/configuration/) for `options`.

## `acme.createInvoice(input)`

| Field | Type | |
| --- | --- | --- |
| `customer` | `string` | The customer's id. |
| `amount` | `number` | In the currency's smallest unit (kobo for NGN). |
| `currency` | `string` | An ISO 4217 code. |

Returns the invoice.

## `acme.getInvoice(id)`

Returns the invoice, or throws `NotFoundError`.

## `acme.listInvoices(filters?)`

Returns an async iterator over every matching invoice; see [pagination](/guides/pagination/).
