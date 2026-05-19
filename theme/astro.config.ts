// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { defineConfig } from 'astro/config';
import freelancePersona from './src/freelance-persona/integration';

export default defineConfig({
  integrations: [
    freelancePersona()
  ],
});