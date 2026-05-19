// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

/// <reference path="../.astro/types.d.ts" />

declare module '@freelance-persona/config' {
  import type { PersonaConfig } from './freelance-persona/types';
  export const themeConfig: PersonaConfig;
  export default themeConfig;
}