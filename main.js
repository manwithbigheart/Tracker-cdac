// Import modules
import { initAuth, signIn, signOut, signInWithEmail, registerWithEmail, showEmailAuth } from './auth.js';
import { togglePomodoroUI, setTimerMode, resetPomoTimer, togglePomoTimer } from './timer.js';
import { toggleState, switchView } from './syllabus.js';

// Assign to window for onclick
window.signIn = signIn;
window.signOut = signOut;
window.signInWithEmail = signInWithEmail;
window.registerWithEmail = registerWithEmail;
window.showEmailAuth = showEmailAuth;
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