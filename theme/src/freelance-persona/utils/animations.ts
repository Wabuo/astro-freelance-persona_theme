// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// src/freelance-persona/utils/animations.ts
import type { VisualsConfig } from '../types';

export interface AnimationConfig {
  enabled: boolean;
  duration: number;
  delay: number;
  threshold: number;
  root_margin: string;
}

export interface DelaysConfig {
  heading: number;
  content: number;
  stagger: number;
}

function getAnimationConfig(visuals?: VisualsConfig): AnimationConfig {
  const scrollAnimations = visuals?.scroll_animations || {};
  const delays = visuals?.delays || {};
  
  return {
    enabled: scrollAnimations.enabled ?? true,
    duration: scrollAnimations.duration ?? 500,
    delay: scrollAnimations.delay ?? 0,
    threshold: scrollAnimations.threshold ?? 0.1,
    root_margin: scrollAnimations.root_margin ?? "0px 0px -50px 0px",
  };
}

function getDelaysConfig(visuals?: VisualsConfig): DelaysConfig {
  const delays = visuals?.delays || {};
  return {
    heading: delays.heading ?? 0,
    content: delays.content ?? 0,
    stagger: delays.stagger ?? 150,
  };
}

/**
 * Initialize scroll animations using IntersectionObserver
 * This replaces AOS with a lightweight, config-driven implementation
 */
export function initScrollAnimations(themeConfig: { visuals?: VisualsConfig }) {
  const animConfig = getAnimationConfig(themeConfig.visuals);
  const delaysConfig = getDelaysConfig(themeConfig.visuals);
  
  // Transition from 'loading' to 'ready' state
  document.documentElement.classList.add("js-ready");
  document.documentElement.classList.remove("js-loading");

  if (!animConfig.enabled) {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.add("revealed");
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.transform = "none";
    });
    return;
  }

  const elements = document.querySelectorAll("[data-reveal]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: animConfig.threshold,
      rootMargin: animConfig.root_margin,
    },
  );

  elements.forEach((el) => {
    // Skip elements already revealed during VT swap (instant-reveal)
    if (el.classList.contains("revealed")) {
      (el as HTMLElement).style.transition = "";
      return;
    }

    // Apply duration from config if not overridden inline
    const htmlEl = el as HTMLElement;
    if (!htmlEl.style.transitionDuration) {
      htmlEl.style.transitionDuration = animConfig.duration + "ms";
    }

    // --- DELAY LOGIC ---
    let delay = 0;
    const inlineDelay = el.getAttribute("data-reveal-delay");
    
    if (inlineDelay) {
      delay = parseInt(inlineDelay, 10);
    } else {
      // Check if element is a MAIN heading (H1, H2, or .section-title)
      const isHeading = 
        /^(H[1-2])$/i.test(el.tagName) || 
        el.classList.contains("section-title");
        
      if (isHeading) {
        delay = delaysConfig.heading;
      } else {
        delay = delaysConfig.content;
      }
      
      // Fallback to animConfig generic delay if specific ones aren't set
      if (delay === 0 && animConfig.delay) {
        delay = animConfig.delay;
      }
    }

    if (delay) {
      htmlEl.style.transitionDelay = delay + "ms";
    }
    
    // --- STAGGERING SUPPORT (Minimal) ---
    // Automatically stagger children if this element is a grid container
    const gridItems = el.querySelectorAll('.info-item, .post-entry, .row > [class*="col-"]');
    if (gridItems.length > 1) {
      const staggerTime = delaysConfig.stagger || 150;
      gridItems.forEach((item, index) => {
        const itemEl = item as HTMLElement;
        if (!itemEl.style.transition) {
          itemEl.style.transition = `opacity ${animConfig.duration}ms ease-out, transform ${animConfig.duration}ms ease-out`;
          itemEl.style.transitionDelay = (delay + (index * staggerTime)) + "ms";
        } else {
          itemEl.style.transitionDelay = (delay + (index * staggerTime)) + "ms";
        }
      });
    }

    observer.observe(el);
  });
}

/**
 * Run initialization - call on DOMContentLoaded or after Astro transitions
 */
export function runScrollAnimations(themeConfig: { visuals?: VisualsConfig }) {
  if (!document.documentElement.classList.contains("anim-init")) {
    initScrollAnimations(themeConfig);
    document.documentElement.classList.add("anim-init");
  }
}