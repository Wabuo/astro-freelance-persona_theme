---
title: "Why Bun is the Future"
date: 2024-03-25
description: "Exploring the speed and developer experience of the Bun runtime."
thumbnail: "../../assets/img/background.jpg"
tags: ["coding", "it"]
---

## Fast, All-in-One

Bun is a fast all-in-one JavaScript runtime. It includes a bundler, test runner, and native TypeScript support.

### Performance

It's incredibly fast. Startup times are near instant.

```typescript
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Hello from Bun!");
  },
});
```

## Compatibility

It aims for complete Node.js compatibility, making migration easy.
