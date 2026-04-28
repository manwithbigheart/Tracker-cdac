// --- CURSOR LOGIC ---
const dot = document.getElementById('cursor-dot');
const outline = document.getElementById('cursor-outline');
window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;
    gsap.to(outline, { x: posX, y: posY, duration: 0.15, ease: "power2.out" });
});

// Import modules
import { initAuth, signIn, signOut } from './auth.js';
import { togglePomodoroUI, setTimerMode, resetPomoTimer, togglePomoTimer } from './timer.js';
import { toggleState, switchView } from './syllabus.js';

// Assign to window for onclick
window.signIn = signIn;
window.signOut = signOut;
window.togglePomodoroUI = togglePomodoroUI;
window.setTimerMode = setTimerMode;
window.resetPomoTimer = resetPomoTimer;
window.togglePomoTimer = togglePomoTimer;
window.toggleState = toggleState;
window.switchView = switchView;

// Initialize
(async () => {
    await initAuth();
})();

// PWA
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js");
    });
}