// Theme Toggle
const toggle = document.getElementById("theme-toggle");
toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    toggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// Intersection Observer for Reveal
const revealOption = {
    threshold: 0.15
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, revealOption);

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Typing Effect
const textEl = document.querySelector(".typing");
const roles = ["Full Stack Developer", "Computer Science Engineer", "Cloud & DevOps Enthusiast", "Problem Solver"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        textEl.textContent = currentRole.substring(0, charIndex--);
        typingSpeed = 50;
    } else {
        textEl.textContent = currentRole.substring(0, charIndex++);
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex > currentRole.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
        typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
}

// Mouse Follower Enhancements
document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;

    const glow1 = document.querySelector(".bg-glow");
    glow1.style.left = `${x}px`;
    glow1.style.top = `${y}px`;
    glow1.style.transform = "translate(-50%, -50%)";
});

// Scroll Progress & Header Shrink
window.addEventListener("scroll", () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progress = document.getElementById("scroll-progress");
    if (progress) progress.style.width = scrolled + "%";

    const header = document.querySelector("header");
    if (winScroll > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// Card Tilt Effect
const initCards = () => {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
        });
    });
};

// Initialize
window.addEventListener("DOMContentLoaded", () => {
    type();
    initCards();
});
