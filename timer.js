import { pomoState, focusQuotes, shortBreakQuotes, longBreakQuotes } from './state.js';

// --- AUDIO ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playHighPitchAlarm() {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(880, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1);
    g.gain.setValueAtTime(0.5, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 1);
}

// --- ALARM LOGIC ---
let alarmInterval = null, vibrationInterval = null, wakeLock = null;
async function enableWakeLock() {
    try {
        if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
    } catch (e) {}
}
function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
    }
}
function startAlarmLoop() {
    enableWakeLock();
    playHighPitchAlarm();
    alarmInterval = setInterval(playHighPitchAlarm, 1000);
    if ('vibrate' in navigator) {
        navigator.vibrate([500, 300, 500]);
        vibrationInterval = setInterval(() => {
            navigator.vibrate([500, 300, 500]);
        }, 1500);
    }
    document.getElementById('alarm-modal').style.display = 'flex';
}
function stopAlarmCompletely() {
    if (alarmInterval) clearInterval(alarmInterval);
    if (vibrationInterval) clearInterval(vibrationInterval);
    alarmInterval = null;
    vibrationInterval = null;
    navigator.vibrate?.(0);
    releaseWakeLock();
    document.getElementById('alarm-modal').style.display = 'none';
}
function snoozeAlarm() {
    stopAlarmCompletely();
    pomoState.time = 5 * 60;
    pomoState.maxTime = 5 * 60;
    updatePomoDisplay();
    setTimeout(startAlarmLoop, 5 * 60 * 1000);
}

export function togglePomoTimer() {
    if (pomoState.active) {
        clearInterval(pomoState.interval);
        document.getElementById('pomo-action-btn').innerHTML = '<i class="fa-solid fa-play ml-1"></i>';
    } else {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        pomoState.interval = setInterval(() => {
            pomoState.time--;
            updatePomoDisplay();
            if (pomoState.time <= 0) {
                clearInterval(pomoState.interval);
                startAlarmLoop();
                if ('Notification' in window && Notification.permission === 'granted') new Notification("Time's Up!");
            }
        }, 1000);
        document.getElementById('pomo-action-btn').innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
    pomoState.active = !pomoState.active;
}

export function setTimerMode(min, mode) {
    pomoState.active = false;
    clearInterval(pomoState.interval);
    pomoState.maxTime = min * 60;
    pomoState.time = min * 60;
    pomoState.mode = mode;
    updatePomoDisplay();
    updatePomoQuote();
    document.getElementById('pomo-action-btn').innerHTML = '<i class="fa-solid fa-play ml-1"></i>';
}

export function resetPomoTimer() {
    pomoState.active = false;
    clearInterval(pomoState.interval);
    pomoState.time = pomoState.maxTime;
    updatePomoDisplay();
    document.getElementById('pomo-action-btn').innerHTML = '<i class="fa-solid fa-play ml-1"></i>';
}

export function togglePomodoroUI() {
    document.getElementById('pomodoro-overlay').classList.toggle('hidden');
}

// --- INTERNAL HELPERS ---
function updatePomoDisplay() {
    const m = Math.floor(pomoState.time / 60), s = pomoState.time % 60;
    document.getElementById('pomo-timer').innerText = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    const c = 879; // Circumference
    document.getElementById('pomo-ring').style.strokeDashoffset = c - (pomoState.time / pomoState.maxTime) * c;
}
function updatePomoQuote() {
    let arr = focusQuotes;
    if (pomoState.mode === 'short') arr = shortBreakQuotes;
    if (pomoState.mode === 'long') arr = longBreakQuotes;
    document.getElementById('pomo-quote').innerText = `"${arr[Math.floor(Math.random() * arr.length)]}"`;
    document.getElementById('pomo-mode-label').innerText = pomoState.mode + " PROTOCOL";
}

window.snoozeAlarm = snoozeAlarm;
window.stopAlarmCompletely = stopAlarmCompletely;