/* ============================================================
   GAYATRI GOND — PORTFOLIO  |  script.js
   ============================================================ */

'use strict';

/* ── Theme ───────────────────────────────────────────────── */
const html         = document.documentElement;
const themeBtn     = document.getElementById('theme-toggle');
const STORED_THEME = localStorage.getItem('portfolio-theme');

function applyTheme(theme) {
    html.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
}

// Initial theme: persisted → system preference → light
(function () {
    if (STORED_THEME) {
        applyTheme(STORED_THEME);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
})();

themeBtn.addEventListener('click', () => {
    applyTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
});

/* ── Mobile nav ──────────────────────────────────────────── */
const menuBtn  = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');

function closeMenu() {
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
}

menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
});

// Close on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close on outside click
document.addEventListener('click', e => {
    if (!e.target.closest('#site-header')) closeMenu();
});

/* ── Scroll progress & header ────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');
const header      = document.getElementById('site-header');

function onScroll() {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar
    if (progressBar) {
        progressBar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
    }

    // Header background
    header.classList.toggle('scrolled', scrolled > 20);
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ── Intersection observer — reveal animations ───────────── */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target); // fire once
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

document.querySelectorAll('.animate-fade-up').forEach(el => revealObserver.observe(el));

/* ── Active nav link on scroll ───────────────────────────── */
const sections  = document.querySelectorAll('section[id], #education');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    },
    { threshold: 0.4 }
);

sections.forEach(sec => sectionObserver.observe(sec));

/* ── Smooth scroll for all # links ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
