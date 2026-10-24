---
title: Errors
description: What the SDK throws, and when.
slug: 1.0/reference/errors
---

Every error extends `SahelError` and carries the request id, which support will ask for.

| Error | When |
| --- | --- |
| `AuthenticationError` | The API key is missing or wrong. |
| `NotFoundError` | The thing you asked for doesn't exist. |
| `ValidationError` | A field was missing or invalid; `error.fields` lists them. |
| `RateLimitError` | Too many requests; `error.retryAfter` says how long to wait. |
