---
title: Errors
description: What the SDK throws, and when.
---

Every error extends `AcmeError` and carries the request id, which support will ask for.

| Error | When |
| --- | --- |
| `AuthenticationError` | The API key is missing or wrong. |
| `NotFoundError` | The thing you asked for doesn't exist. |
| `ValidationError` | A field was missing or invalid; `error.fields` lists them. |
| `ConflictError` | The request repeats one with the same idempotency key but a different body. |
| `RateLimitError` | Too many requests; `error.retryAfter` says how long to wait. |
