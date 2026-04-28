import { firebaseConfig } from './config.js';
import { appState, defaultSyllabus } from './state.js';
import { renderAll } from './ui.js';

// Wait for Firebase to load
function waitForFirebase() {
    return new Promise((resolve) => {
        if (typeof firebase !== 'undefined') {
            resolve();
        } else {
            const checkFirebase = setInterval(() => {
                if (typeof firebase !== 'undefined') {
                    clearInterval(checkFirebase);
                    resolve();
                }
            }, 100);
        }
    });
}

let firebaseApp, auth, db, provider;

async function initializeFirebase() {
    await waitForFirebase();
    firebaseApp = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth(firebaseApp);
    db = firebase.firestore(firebaseApp);
    provider = new firebase.auth.GoogleAuthProvider();
}

export { auth, db, provider };

export function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function showAuthError(message, emailMode = false) {
    const id = emailMode ? 'auth-email-error' : 'auth-error';
    const el = document.getElementById(id);
    if (!el) return;
    el.innerText = message;
    el.classList.remove('hidden');
}

export function hideAuthErrors() {
    document.getElementById('auth-error')?.classList.add('hidden');
    document.getElementById('auth-email-error')?.classList.add('hidden');
}

export let currentUid = null;
export let currentSessionId = Date.now().toString();

export function signIn() {
    hideAuthErrors();
    auth.signInWithPopup(provider).catch(e => {
        showAuthError(e.message);
    });
}

export async function signInWithEmail() {
    hideAuthErrors();
    const email = document.getElementById('auth-email')?.value.trim();
    const password = document.getElementById('auth-password')?.value;
    if (!email || !password) {
        showAuthError('Email and password are required.', true);
        return;
    }
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (e) {
        showAuthError(e.message, true);
    }
}

export async function registerWithEmail() {
    hideAuthErrors();
    const name = document.getElementById('auth-name')?.value.trim();
    const phone = document.getElementById('auth-phone')?.value.trim();
    const email = document.getElementById('auth-email')?.value.trim();
    const password = document.getElementById('auth-password')?.value;
    if (!name || !email || !password) {
        showAuthError('Name, email, and password are required.', true);
        return;
    }
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        await db.collection('users').doc(userCredential.user.uid).set({
            profile: { name, phone, email },
            activeSessionId: currentSessionId
        }, { merge: true });
    } catch (e) {
        showAuthError(e.message, true);
    }
}

export function signOut() {
    auth.signOut().then(() => location.reload());
}

export function showEmailAuth() {
    const panel = document.getElementById('email-auth-panel');
    panel?.classList.toggle('hidden');
}

export async function initAuth() {
    await initializeFirebase();
    auth.onAuthStateChanged(user => {
        hideAuthErrors();
        if (user) {
            currentUid = user.uid;
            document.getElementById('auth-overlay').classList.add('hidden');
            document.getElementById('user-photo').src = user.photoURL || '';
            document.getElementById('user-photo').classList.remove('hidden');
            document.getElementById('user-name').innerText = user.displayName || user.email || 'Member';
            db.collection('users').doc(user.uid).set({ activeSessionId: currentSessionId }, { merge: true });
            initUserData(user);
            requestNotificationPermission();
        }
    });
}

async function initUserData(user) {
    db.collection('users').doc(user.uid).onSnapshot(doc => {
        if (doc.exists) {
            const data = doc.data();
            if (data.activeSessionId && data.activeSessionId !== currentSessionId) {
                document.getElementById('session-lock').classList.remove('hidden');
                return;
            }
            if (data.appState) {
                appState = data.appState;
                if (!appState.syllabus) appState.syllabus = JSON.parse(JSON.stringify(defaultSyllabus));
                renderAll();
            }
        } else {
            saveToCloud();
        }
    });
}

export function saveToCloud() {
    if (currentUid) db.collection('users').doc(currentUid).set({ appState, activeSessionId: currentSessionId }, { merge: true });
}