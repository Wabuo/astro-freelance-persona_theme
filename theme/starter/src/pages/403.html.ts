// theme/starter/src/pages/403.html.ts
/*
 * SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
 * SPDX-License-Identifier: MIT
 */

/*
 * Hosts (ferron, nginx, Caddy, Cloudflare, ...) look for a flat `403.html`
 * next to the site when they need to answer a 403. Astro only special-cases
 * `404.astro`, so `403.astro` alone builds to `403/index.html` and no host can
 * use it. A static file endpoint always emits a real file, independent of
 * `build.format`, so this route renders the same page to `dist/403.html`.
 *
 * See https://github.com/withastro/astro/issues/4418
 */

import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Error403 from "./403.astro";

export const GET: APIRoute = async () => {
  const container = await AstroContainer.create();
  const rendered = await container.renderToString(Error403);
  // the container returns the page body, so restore the doctype Astro's own
  // page output has
  const html = /^<!doctype/i.test(rendered)
    ? rendered
    : `<!DOCTYPE html>\n${rendered}`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
