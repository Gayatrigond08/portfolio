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
const roles = ["Full Stack Developer", "Cloud Enthusiast", "DevOps Learner", "UI/UX Aficionado"];
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

// Mouse Follower for BG Glow
document.addEventListener("mousemove", (e) => {
    const glow = document.querySelector(".bg-glow");
    const x = e.clientX;
    const y = e.clientY;
    glow.style.transform = `translate(${x/50}px, ${y/50}px)`;
});

// Initialize
window.addEventListener("DOMContentLoaded", () => {
    type();
});
