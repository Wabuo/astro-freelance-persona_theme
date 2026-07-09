// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// src/freelance-persona/utils/dropdown.ts

/**
 * Shared dropdown/popover utilities
 * Used by theme toggle, share menu, mobile nav
 */

/**
 * Initialize dropdown behavior for elements with popover attribute
 * Handles: close other dropdowns on open, keyboard support
 */
export function initDropdown(): void {
  // Close other popovers when one opens
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    
    // Check if clicking a popover target button
    const trigger = target.closest("[popovertarget]") as HTMLButtonElement | null;
    if (!trigger) return;

    const popoverId = trigger.getAttribute("popovertarget");
    if (!popoverId) return;

    const popover = document.getElementById(popoverId) as HTMLElement | null;
    if (!popover) return;

    // Close other popovers
    document.querySelectorAll("[popover]:popover-open").forEach((other) => {
      if (other !== popover) {
        (other as HTMLElement).hidePopover();
      }
    });
  });

  // Global click-outside to close (for non-popover dropdowns)
  document.addEventListener("click", (e) => {
    const target = e.target as Node;
    const inDropdown = target.parentElement?.closest("[data-dropdown]");
    if (!inDropdown) {
      document.querySelectorAll("[data-dropdown].open").forEach((dd) => {
        dd.classList.remove("open");
      });
    }
  });

  // ESC key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll("[popover]:popover-open").forEach((popover) => {
        (popover as HTMLElement).hidePopover();
      });
      document.querySelectorAll("[data-dropdown].open").forEach((dd) => {
        dd.classList.remove("open");
      });
    }
  });
}

/**
 * Initialize popover trigger with dropdown ID
 * Handles: aria-expanded, close other popovers
 */
export function initPopoverTrigger(triggerSelector: string): void {
  const triggers = document.querySelectorAll(triggerSelector);
  
  triggers.forEach((trigger) => {
    const popoverId = trigger.getAttribute("popovertarget");
    if (!popoverId) return;

    const popover = document.getElementById(popoverId);
    if (!popover) return;

    trigger.addEventListener("click", () => {
      const isOpen = popover.matches(":popover-open");
      
      if (!isOpen) {
        // Close other popovers
        document.querySelectorAll("[popover]:popover-open").forEach((other) => {
          if (other !== popover) {
            (other as HTMLElement).hidePopover();
          }
        });
      }
      
      // Update aria-expanded
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

/**
 * Initialize dropdown with custom close behavior
 * Used for theme toggle, share menu, mobile nav
 */
export function initCustomDropdown(
  dropdownSelector: string,
  options: {
    triggerSelector?: string;
    closeOnOutsideClick?: boolean;
    closeOnEscape?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
  } = {}
): void {
  const dropdowns = document.querySelectorAll(dropdownSelector);
  
  dropdowns.forEach((dropdown) => {
    const triggerSelector = options.triggerSelector || 
      `[popovertarget="${dropdown.id}"]`;
    const trigger = document.querySelector(triggerSelector);
    
    if (trigger) {
      trigger.addEventListener("click", () => {
        const isOpen = dropdown.matches(":popover-open") || 
          dropdown.classList.contains("open");
        
        if (!isOpen) {
          // Close other dropdowns
          document.querySelectorAll(`${dropdownSelector}:popover-open, ${dropdownSelector}.open`)
            .forEach((other) => {
              if (other !== dropdown) {
                if (other.matches(":popover-open")) {
                  (other as HTMLElement).hidePopover();
                } else {
                  other.classList.remove("open");
                }
              }
            });
        }
        
        if (options.onOpen) options.onOpen();
      });
    }
  });

  if (options.closeOnOutsideClick) {
    document.addEventListener("click", (e) => {
      const target = e.target as Node;
      const triggerSelector = options.triggerSelector || 
        `[popovertarget="${dropdowns[0]?.id}"]`;
      if (!target.parentElement?.closest(dropdownSelector) &&
          !target.parentElement?.closest(triggerSelector)) {
        dropdowns.forEach((dd) => {
          if (dd.matches(":popover-open")) {
            (dd as HTMLElement).hidePopover();
          } else {
            dd.classList.remove("open");
          }
          if (options.onClose) options.onClose();
        });
      }
    });
  }

  if (options.closeOnEscape) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        dropdowns.forEach((dd) => {
          if (dd.matches(":popover-open")) {
            (dd as HTMLElement).hidePopover();
          } else {
            dd.classList.remove("open");
          }
          if (options.onClose) options.onClose();
        });
      }
    });
  }
}