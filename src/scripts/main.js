// src/scripts/main.js
import sal from 'sal.js';
import Typed from 'typed.js';
// Bootstrap's JS needs to be imported to activate components like ScrollSpy or Collapse (for mobile menu)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

const CONFIG = {
  preloader: {
    selector: '#preloader'
  },
  sal: {
    threshold: 0.1,
    once: true,
  },
  typed: {
    selector: '.typed',
    attribute: 'data-typed-items',
    options: {
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    }
  },
  scrollTop: {
    selector: '.scroll-top',
    threshold: 100
  }
};

const App = {
  init() {
    this.initPreloader();
    
    document.addEventListener('DOMContentLoaded', () => {
      this.initSal();
      this.initTyped();
      this.initScrollTop();
      this.initMobileNavToggle();
    });

    this.initScrollEvents();
  },

  initPreloader() {
    const preloader = document.querySelector(CONFIG.preloader.selector);
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.remove();
      });
    }
  },

  initSal() {
    sal(CONFIG.sal);
  },

  initTyped() {
    const typedElements = document.querySelectorAll(CONFIG.typed.selector);
    typedElements.forEach(element => {
      const strings = element.getAttribute(CONFIG.typed.attribute);
      if (strings) {
        new Typed(element, {
          strings: strings.split(','),
          ...CONFIG.typed.options
        });
      }
    });
  },

  initScrollTop() {
    const scrollTopBtn = document.querySelector(CONFIG.scrollTop.selector);
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      this.scrollTopBtn = scrollTopBtn;
    }
  },

  toggleScrollTopVisibility() {
    if (this.scrollTopBtn) {
      if (window.scrollY > CONFIG.scrollTop.threshold) {
        this.scrollTopBtn.classList.add('active');
      } else {
        this.scrollTopBtn.classList.remove('active');
      }
    }
  },
  
  // Basic mobile nav toggle - we will refine this when we build the Navigation component
  initMobileNavToggle() {
    const toggleBtn = document.querySelector('.nav-toggle');
    const header = document.querySelector('.header');
    if(toggleBtn && header) {
      toggleBtn.addEventListener('click', () => {
        header.classList.toggle('navmenu-show');
        toggleBtn.classList.toggle('bi-list');
        toggleBtn.classList.toggle('bi-x');
      });
    }
  },

  initScrollEvents() {
    const handleScroll = () => {
      this.toggleScrollTopVisibility();
    };
    window.addEventListener('load', handleScroll);
    document.addEventListener('scroll', handleScroll);
  }
};

App.init();
