// src/scripts/layout.js

/**
 * Modern Scroll Animations using IntersectionObserver
 * Replaces Sal.js/AOS with native browser API (Zero dependencies)
 */
const initScrollAnimations = () => {
  // 1. Select all elements that have a 'data-aos' attribute
  const elements = document.querySelectorAll('[data-aos]');

  // 2. Define the observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a class when the element is visible
        entry.target.classList.add('aos-animate');
        
        // Optional: Stop observing once animated (perf boost)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the bottom
  });

  // 3. Start observing
  elements.forEach(el => observer.observe(el));
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
});

// --- Keep your KaTeX logic here (it was fine) ---
// 2. Dynamic KaTeX Loading
const body = document.querySelector('body');
if (body && body.dataset.tex === 'true') {
  Promise.all([
    import('katex/dist/katex.min.css'),
    import('katex/dist/contrib/auto-render.js')
  ]).then(([_, autoRenderModule]) => {
    const renderMathInElement = autoRenderModule.default || autoRenderModule;
    if (typeof renderMathInElement === 'function') {
      renderMathInElement(document.body, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false},
          {left: '\\(', right: '\\)', display: false},
          {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError : false
      });
    }
  }).catch(err => console.error("Failed to load KaTeX:", err));
}